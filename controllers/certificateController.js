const express = require('express');
const multer = require('multer');
const fs = require('fs');
const xlsx = require('xlsx');
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const {JSDOM} = require('jsdom');
const {createCanvas} = require('canvas');
const pdf = require('html-pdf-chrome');


const Event = require("../models/Events");
const Certificate = require("../models/Certificates");
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'certTemp') {
            cb(null, './public/files/certificates');
        } else if (file.fieldname === 'certData') {
            cb(null, './public/files/certificateData');
        } else {
            cb(new Error('Invalid fieldname'));
        }
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.split(".")[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + ext;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({storage: storage}).fields([
    {name: 'certTemp', maxCount: 1},
    {name: 'certData', maxCount: 1}
]);

exports.createCertificate = async (req, res) => {
    try {
        // Upload HTML files
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading HTML
                return res.json({
                    success: false,
                    message: err.message,
                    error: "Multer"
                });
            } else if (err) {
                // An unknown error occurred when uploading HTML
                return res.json({
                    success: false,
                    message: err.message,
                    error: "Unknown"
                });
            } else {
                if (!req.files || !req.files['certTemp'] || !req.files['certData']) {
                    // No file uploaded
                    return res.json({
                        success: false,
                        message: "Both files are required",
                        error: "NoFile"
                    });
                }

                // PDF files uploaded successfully
                let certificate = await Certificate.create({
                    eventId: req.body.eventId,
                    certTemp: req.files['certTemp'][0].filename,
                    certData: req.files['certData'][0].filename,
                });

                res.redirect('/editCertificates');
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


exports.updateCertificate = async (req, res) => {
    try {
        // console.log(req.body);
        let event = await Event.findOneAndUpdate({_id: req.params.id}, req.body);
        event = await Event.find({_id: req.params.id})
        // res.json({
        //   success:true,
        //   event
        // })
        res.redirect('/editCertificates')
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}

exports.getCertificates = async (req, res) => {
    try {
        let certificates = await Certificate.find();
        res.json({
            success: true,
            certificates
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.deleteCertificate = async (req, res) => {
    try {
        let event = await Event.findOneAndDelete({_id: req.params.id})
        // res.json({
        //   success:true,
        //   message:"Event Deleted Successfully"
        // })
        res.redirect('/editEvents')

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}

exports.generateCertificatePdf = async (req, res) => {
    const {email, eventId} = req.body;
    console.log(email, eventId)

    let certificate = await Certificate.findOne({eventId: eventId});

    if (!certificate) {
        return res.status(404).json({message: 'This event does not have certificate data'});
    }

    const recordsPath = './public/files/certificateData/' + certificate.certData;
    const templatePath = './public/files/certificates/' + certificate.certTemp;

    try {
        if (!recordsPath || !fs.existsSync(recordsPath)) {
            throw new Error('Records file not found');
        }

        if (!templatePath || !fs.existsSync(templatePath)) {
            throw new Error('Template file not found');
        }

        const workbook = xlsx.readFile(recordsPath);

        if (!workbook) {
            throw new Error('Workbook not found');
        }

        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
            throw new Error('Sheet not found');
        }

        const worksheet = workbook.Sheets[sheetName];
        const records = xlsx.utils.sheet_to_json(worksheet);

        if (!records || records.length === 0) {
            return res.status(404).json({message: 'No records found'});
        }

        console.log('Parsed records:', records);

        const user = records.find(record => record['Email'] === email);

        if (!user) {
            res.status(404).json({message: 'Email was not found in records'});
        }

        console.log('User found:', user['Name']);

        const pdfBuffer = await generateCertificate(templatePath, user);
        console.log('PDF generated for user:', user);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificate.pdf`);
        res.send(pdfBuffer);
    } catch (err) {
        console.error('Error generating certificate:', err);
        res.status(500).json({message: 'Error generating certificate', error: err.message});
    }
}

async function generateCertificate(templatePath, details) {
    try {
        // Read the HTML template
        const template = fs.readFileSync(templatePath, 'utf8');

        // Compile the template
        const compiledTemplate = Handlebars.compile(template);

        const html = compiledTemplate(details);

        // Use JSDOM to create a virtual DOM
        const dom = new JSDOM(html, {resources: 'usable', runScripts: 'dangerously'});

        // Use html-pdf-chrome to convert the DOM to PDF
        const canvas = createCanvas(800, 600);
        const pdfBuffer = await pdf.create(html, {
            printOptions: {
                scale: 1,
                landscape: false,
                paperWidth: 8.5,
                paperHeight: 11,
            },
            printBackground: true,
            canvas: canvas,
        });

        return pdfBuffer.toBuffer();
    } catch (err) {
        throw new Error(`Failed to generate certificate: ${err.message}`);
    }

}
