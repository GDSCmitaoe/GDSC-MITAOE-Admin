const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const teamController = require('../controllers/teamController')

router.get('/',teamController.getTeams)
router.get('/:id',teamController.getOneMember)

router.post('/create',auth.isAdmin,teamController.createTeam);
router.post('/update/:id',auth.isAdmin,teamController.updateMember);
router.post('/delete/:id',auth.isAdmin,teamController.deletMember)

module.exports = router;