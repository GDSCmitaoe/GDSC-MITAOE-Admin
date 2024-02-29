const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const certificateController = require('../controllers/certificateController')

router.get('/',certificateController.getCertificates)

router.post('/create',auth.isAdmin,certificateController.createCertificate);
router.post('/update/:id',auth.isAdmin,certificateController.updateCertificate);
router.post('/delete/:id',auth.isAdmin,certificateController.deleteCertificate);

module.exports = router;