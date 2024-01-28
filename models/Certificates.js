const mongoose = require('mongoose');

const CertificateSchema = mongoose.Schema({
    title:{
        type:"String"
    },
    eventId: String,
    img:String,
})

const Event = mongoose.model("Event",EventSchema);

module.exports = Event;