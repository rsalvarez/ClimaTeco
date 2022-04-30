const express = require('express');
const app = express();
var router = express.Router()             
const jwt = require('jsonwebtoken');
require('dotenv').config();
const request = require('supertest');
const assert = require('assert');

const tiempo = require('./server/server');

let { verificaTk } = require('./midellware/autenticacion');


// generamos token para "darle mas seguridad al momento de llamar el api."
router.get('/login', (req, res) => {
    let token = jwt.sign({
        usuario: {client_id:1, nombre:'Rafael', apellido:'Alvarez'}
    }, process.env.SEED, { expiresIn: '1d' });
    res.json({
            result: 'ok', token
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

router.get('/forecast/:city?', verificaTk, (req, res) => {
    let ubicacion = {};
    tiempo.getLatLong(req.params.city).then((result) => {
        ubicacion = result;
    });
    tiempo.getLugarLatlong(req.params.city,'fiveDays').then((result) => {
        //console.log(result);
        res.json({
                    ubicacion : ubicacion, 
                    pronostico : result
                });
    }).catch((err) => {
        res.status(500).json(err);
    })


});

app.use('/v1/',router);

// pruebas con supertest
request(app)
  .get('/v1/login')
  .expect('Content-Type', 'application/json; charset=utf-8')
  .expect(200)
  .end(function(err, res) {
      // resultado del "login ficticio"
    var token = JSON.parse(res.text).token;
    if (err) throw err;
    console.log ('Resultado de /v1/login');
    console.log(JSON.parse(res.text));
    const ret =  request(app)
    // resultado del obtenemos la geo del IP
    .get('/v1/location')
    .set({ Authorization: token })
    .set('Accept', 'application/json')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .end(function(err, res) {
        console.log ('Resultado de /v1/location');
        console.log(JSON.parse(res.text));
        const ret =  request(app)
                    // el current de la ciudad cordoba
                    .get('/v1/current/Cordoba,Argentina')
                    .set({ Authorization: token })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200)
                    .end(function(err, res) {
                        console.log ('Resultado de /v1/current');
                        console.log(JSON.parse(res.text));
                        const ret =  request(app)
                                // el forecast de la ciudad cordoba
                                .get('/v1/forecast/Cordoba,Argentina')
                                .set({ Authorization: token })
                                .set('Accept', 'application/json')
                                .expect('Content-Type', 'application/json; charset=utf-8')
                                .expect(200)
                                .end(function(err, res) {
                                    console.log ('Resultado de /v1/forecast');
                                    console.log(JSON.parse(res.text));
                                })
                    })

    })
  });

app.listen(process.env.PORT, () => {
    console.log('Escuchando peticiones en puerto : ', process.env.PORT);
    
});
