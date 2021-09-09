const express = require('express');
const app = express();
const bodyparser = require('body-parser');

// route middlewares comprobacion de que esta bien el servidor
/*app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});*/

// cors
const cors = require('cors');
var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));


require('dotenv').config()
const port = process.env.PORT || 3001;

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos
const mongoose = require('mongoose');
const url = `mongodb://veterinaria-mascotas:${process.env.PASSWORD}@cluster0-shard-00-00.ocwwa.mongodb.net:27017,cluster0-shard-00-01.ocwwa.mongodb.net:27017,cluster0-shard-00-02.ocwwa.mongodb.net:27017/${process.env.BBDD}?ssl=true&replicaSet=atlas-attp1g-shard-0&authSource=admin&retryWrites=true&w=majority`;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true
})
.then(()=>console.log('Base de datos conectada'))
.catch(e=>console.log(e))

// import routes
const authRoutes = require('./routes/rutas');
app.use('/api/user', authRoutes);

// Acceso a Admin si el token es valido
const verifyToken = require('./routes/validate-token');
const administrador = require('./routes/admin');
app.use('/api/admin', verifyToken, administrador); //Verificará el token antes de pasar a admin.


// iniciar server
app.listen(port, () => {
    console.log(`servidor andando en: ${port}`)
})