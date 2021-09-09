const User = require('../models/User');

const {schemaRegister, schemaLogin}=require('./validaciones');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const UserRegister=async (req, res) => {
    // validate data of user
    const { error } = schemaRegister.validate(req.body) // Devuelve true/false si existe algun error.
    if (error) return res.status(400).json({error: error.details[0].message} ) //responde con una advertencia
    
    //validate email
    const isEmailExist = await User.findOne({ email: req.body.email }); // Devuelve true/false, si existe el email en bd.
    if (isEmailExist)  return res.status(400).json( {error:true, message: 'Email ya registrado'} )

  // hash and encrypt contraseña 
  const salt = await bcrypt.genSalt(10); //permite realizar la cantidad de veces de va a repetir el cifrado.
  const password = await bcrypt.hash(req.body.password, salt); //encripta la contraseña

  const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: password
  });

  try {
      const savedUser = await user.save();
      res.json({
          error: null,
          data: savedUser
      })
  } catch (error) {
      res.status(400).json({ error })
  }

};

const UserLogin=async (req, res) => {
    // validate user
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })
    
    // validate email
    const user = await User.findOne({ email: req.body.email });  //Verifica si el email existe 
    if (!user) return res.status(400).json({ error:true, message: 'Credenciales invalidas'} );

    //compracion de password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error:true, message: 'Credenciales invalidas'})
    
      // create token password
      //payload
      const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.TOKEN_SECRET)
    
/*
COMPROBACION
- https://jwt.io
-pegar el token que viene en data
- agregar la palabra secreta
- token estará verificado
 */
    
    res.header('auth-token', token).json({
        error: null,
        message: 'Bienvenido',
        data: {token},
        body:user //Esta linea se podria eliminar
    })
};

module.exports={
    UserRegister,
    UserLogin
}