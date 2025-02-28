
const express = require('express');
const router = express.Router();

//============== RUTAS PARA EL FORMULARIO ==========================

const {
    UserRegister,
    UserLogin
}=require("../controllers/controllerUser");

router.post("/register",UserRegister);
router.post("/login", UserLogin);


module.exports = router;