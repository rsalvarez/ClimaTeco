const request = require('supertest');
const app = require('../app').app;

//describe('GET /v1/login', function() {
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
//}); // fin describe getLogin


    


