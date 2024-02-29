const Event = require('../models/Events');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/events');
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.split(".")[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + ext;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({storage: storage}).single('eventImage')


exports.createEvent = async (req, res) => {
    try {

        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                console.log(err.message);
                return res.json({
                    success: false,
                    message: err.message
                })
            } else if (err) {
                // An unknown error occurred when uploading.

                console.log(err);
                return res.json({
                    success: false,
                    message: err.message
                })
            } else {
                let date = new Date(req.body.date);
                let event = await Event.create({
                    title: req.body.title,
                    img: req.file.filename,
                    tagline: req.body.tagline,
                    date: date,
                    venu: req.body.venu,
                    start_time: req.body.start_time,
                    end_time: req.body.end_time,
                    link: req.body.link,
                    eventId: req.body.eventId
                })

                let newEventId = `${Math.round(Math.random() * 1E9)}`;

                await Event.updateOne({ _id: event._id }, { eventId: newEventId });

                res.redirect('/editEvents')
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.updateEvent = async (req, res) => {
    try {
        // console.log(req.body);
        let event = await Event.findOneAndUpdate({_id: req.params.id}, req.body);
        event = await Event.find({_id: req.params.id})
        // res.json({
        //   success:true,
        //   event
        // })
        res.redirect('/editEvents')
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}

exports.getEvents = async (req, res) => {
    try {
        let current_date = new Date();
        current_date.setDate(current_date.getDate() - 1)
        let upcomingEvents = await Event.find({date: {$gte: current_date}}).sort({date: 'desc'})
        let pastEvents = await Event.find({date: {$lt: current_date}}).sort({date: 'desc'})
        res.json({
            success: true,
            upcomingEvents,
            pastEvents
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.deletEvent = async (req, res) => {
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