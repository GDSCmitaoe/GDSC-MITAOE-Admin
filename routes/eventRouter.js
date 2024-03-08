const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const eventController = require('../controllers/eventController')

router.get('/',eventController.getEvents)

router.post('/create',auth.isAdmin,eventController.createEvent);
router.post('/update/:id',auth.isAdmin,eventController.updateEvent);
router.post('/delete/:id',auth.isAdmin,eventController.deletEvent)

module.exports = router;