// const axios = require('axios');
const Team = require('../models/Teams')
const Event = require('../models/Events')
const Certificate = require('../models/Certificates')

exports.loginAdmin = async (req, res) => {
    try {
        let username = req.body.username;
        let password = req.body.password;
        if (username === "" || password === "") {
            throw Error("Please Provide Credentials")
        }
        if (username !== "GDSC" || password !== "GDSC") {
            throw Error("Invalid Credentials")
        }
        res.cookie("username", "GDSC");
        res.cookie('password', "GDSC")
        res.redirect('/teams')
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

exports.logoutAdmin = async (req, res) => {
    res.clearCookie('username');
    res.clearCookie('password');
    res.redirect('/');
}


exports.getCreateTeamPage = async (req, res) => {
    try {
        res.render('teams/add_member')

    } catch (err) {
        res.json({
            message: err.message
        })
    }
}
exports.getCreateEventPage = async (req, res) => {
    try {
        res.render('events/create_event')
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

exports.getCreateCertificatesPage = async (req, res) => {
    try {
        res.render('certificates/add_certificate')
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

// edit pages
exports.getEditTeamPage = async (req, res) => {
    try {
        let teams = await Team.find({}).sort({year: 'desc'}).sort('position');
        res.render('teams/manage', {
            teams
        })
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}
exports.getEditEventPage = async (req, res) => {
    try {
        let events = await Event.find({}).sort({date: 'desc'});
        res.render('events/manage', {
            events
        })
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

exports.getEditCertificatePage = async (req,res)=>{
    let certificates = await Certificate.find({})
    try {
        res.render('certificates/manage', {
            certificates
        })
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}