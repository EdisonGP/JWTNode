
const express = require('express');
const router = express.Router();

//============== JSON WEB TOKEN ==========================

const {
    UserRegister,
    UserLogin
}=require("../controllers/controllerUser");

router.post("/register",UserRegister);
router.post("/login", UserLogin);


module.exports = router;