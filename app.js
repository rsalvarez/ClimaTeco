const express = require('express');
const app = express();
var router = express.Router()             
const jwt = require('jsonwebtoken');
require('dotenv').config();


const tiempo = require('./server/server');

let { verificaTk } = require('./midellware/autenticacion');


// generamos token para "darle mas seguridad al momento de llamar el api."
router.get('/login', (req, res) => {
    let token = jwt.sign({
        usuario: {client_id:1, nombre:'Rafael', apellido:'Alvarez'}
    }, process.env.SEED, { expiresIn: '1d' });
    res.json({
            result: 'OK', token
        });
});
// retornamos el lat y long mas la descrip de la ciudad
router.get('/location', verificaTk, (req, res) => {
    tiempo.getLatLong().then((result) => {
        res.json(result);

    })  
        
});

// dado una city, opcional, si no viene 
router.get('/current/:city?', verificaTk, (req, res) => {
    
    tiempo.getLugarLatlong(req.params.city,'current').then((result) => {
            res.json(result);
        }).catch((err) => {
            res.status(500).json(err);
        })
    
    
});

// este endpoint develve los 5 dias de pronostico, mas la ubicacion de la ciudad

router.get('/forecast/:city?', verificaTk, (req, res) => {
    let ubicacion = {};
    tiempo.getLatLong(req.params.city).then((result) => {
        ubicacion = result;
    });
    tiempo.getLugarLatlong(req.params.city,'fiveDays').then((result) => {
        res.json({
                    //ubicacion : ubicacion, 
                    pronostico : result
                });
    }).catch((err) => {
        res.status(500).json(err);
    })


});

// Ruta base
app.use('/v1/',router);

module.exports = {
    app
}

app.listen(process.env.PORT, () => {

    console.log('Escuchando peticiones en puerto : ', process.env.PORT);
    
});
