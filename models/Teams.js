const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  img: String,
  name: String,
  designation: String,
  desc: String,
  year: Number,
  position: Number,
  social: {
    type: Object
  }
})

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;