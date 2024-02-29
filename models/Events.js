const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    title:{
        type:"String"
    },
    img:String, 
    tagline:String,
    date:{
        type:Date,
    },
    venu:String,
    start_time:String,
    end_time:String,
    link:String,
    eventId: String
})

const Event = mongoose.model("Event",EventSchema);

module.exports = Event;