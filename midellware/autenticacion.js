const jwt = require('jsonwebtoken');
require('dotenv').config();


let verificaTk = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no validos'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
};

module.exports = {
    verificaTk
}