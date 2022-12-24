const userController = require('../Controllers/userController');
const cros = require('cors');
const express = require('express');
const app = express();
const router = express.Router();
const auth = require('../Middleware/auth');


app.use(cros());


router.post('/api/register', userController.registerUser);

router.post('/api/login', userController.loginUser);

router.get('/api/users', auth, userController.viewUsers);

router.patch('/api/update/:id', auth, userController.updateUser);



module.exports = router;