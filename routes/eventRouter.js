const exrpess = require('express');
const router = exrpess.Router();
const auth = require('../middlewares/auth')
const eventController = require('../controllers/eventController')
// /api/team

router.get('/',eventController.getEvents)

router.post('/create',auth.isAdmin,eventController.createEvent);
router.post('/update/:id',auth.isAdmin,eventController.updateEvent);
router.post('/delete/:id',auth.isAdmin,eventController.deletEvent)



module.exports = router;