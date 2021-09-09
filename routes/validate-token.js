
const jwt = require('jsonwebtoken')

// middleware to validate token (rutas protegidas),solamente sera accesible si se conoce el token
const verifyToken = (req, res, next) => {

    const token = req.header('auth-token');

    if (!token) return res.status(401).json({ error: 'Acceso denegado' }) //Comprueba existencia de token

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next() // continuará hacia admin
    } catch (error) {
        res.status(400).json({error: 'token no es válido'})
    }
}

module.exports = verifyToken;