const express = require('express');
const multer = require('multer');
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

const upload = multer({ storage: storage }).fields([
    { name: 'certTemp', maxCount: 1 },
    { name: 'certData', maxCount: 1 }
]);

exports.createCertificate = async (req, res) => {
    try {
        // Upload PDF files
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading PDF
                return res.json({
                    success: false,
                    message: err.message,
                    error: "Multer"
                });
            } else if (err) {
                // An unknown error occurred when uploading PDF
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
//     try {
//         res.json({
//             success: true,
//             upcomingEvents,
//             pastEvnets
//         })
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         })
//     }
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
    const name = req.params.name;
    const filePath = path.join(__dirname, 'certificate_template.html');

    // Read CSV file and replace placeholders in HTML template
    fs.createReadStream('user_data.csv')
        .pipe(csv())
        .on('data', (row) => {
            if (row.name === name) {
                let html = fs.readFileSync(filePath, 'utf8');
                html = html.replace('{{NAME}}', row.name)
                    .replace('{{COURSE}}', row.course)
                    .replace('{{DATE}}', row.date);

                res.send(html);
            }
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
}
