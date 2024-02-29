const express = require('express');
const router = express.Router(); 
const auth = require('../middlewares/auth')
const clientController = require("../controllers/clientController")

router.get('/login',(req,res)=>{
    res.render('login/index')
})
router.get('/logout',clientController.logoutAdmin)

router.post('/login',clientController.loginAdmin);

router.get('/teams',auth.isAdmin,clientController.getCreateTeamPage);
router.get('/events',auth.isAdmin,clientController.getCreateEventPage);
router.get('/certificates',auth.isAdmin,clientController.getCreateCertificatesPage);

router.get('/editTeams',auth.isAdmin,clientController.getEditTeamPage)
router.get('/editEvents',auth.isAdmin,clientController.getEditEventPage)
router.get('/editCertificates',auth.isAdmin,clientController.getEditCertificatePage)

module.exports = router;