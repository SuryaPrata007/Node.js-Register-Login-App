const adminController = require('../controllers/adminController');
const cros = require('cors');
const express = require('express');
const app = express();
const router = express.Router();
const auth = require('../middleware/auth');


app.use(cros());


router.post('/api/register', adminController.registerAdmin);

router.post('/api/login', adminController.loginAdmin);

router.get('/api/users', auth, adminController.viewAllUsers);

router.patch('/api/update/:id', auth, adminController.updateUsers);


module.exports = router;


