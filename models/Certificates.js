const mongoose = require('mongoose');

const CertificateSchema = mongoose.Schema({
    eventId: String,
    certTemp: String,
    certData: String,
})

const Certificate = mongoose.model("Certificate",CertificateSchema);

module.exports = Certificate;