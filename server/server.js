const axios = require('axios');
require('dotenv').config();
const api = process.env.API;
const getIpClient = require('./externalIP');
//require('../config/yargs').api;


const urls = {
    'current' : 'https://api.openweathermap.org/data/2.5/weather?',
    'fiveDays' : 'https://api.openweathermap.org/data/2.5/forecast?'
    //'fiveDays' : 'https://api.openweathermap.org/data/2.5/onecall?exclude=current,minutely,hourly&'
};

const getLatLong = async (city) => {
    let ip = await getIpClient(); // process.env.IP || '181.89.3.194';
    //console.log(ip);
    
    let  ciudad = city;
    let retorno;
    if (!city || city == '') { // no paso ciudad vemos por IP geolocalizado
        const options = {
            method: 'GET',
            url: encodeURI(`http://ip-api.com/json/${ip}?fields=city,lat,lon,message`)
            };
        
            await axios.request(options).then(function (response) {
                //console.log(response.data);
                ciudad =  response.data.city;
            }).catch(function (error) {
                ciudad = '';
            });
        
    }
    const optionCity = {
        url : encodeURI(`https://nominatim.openstreetmap.org/search/${ciudad}?format=json&addressdetails=1&limit=1&polygon_svg=1`)
    }
    //console.log(optionCity);   
    await axios.request(optionCity).then(function (response) {
        retorno =  {lat : response.data[0].lat, lon : response.data[0].lon, city : ciudad, metodo : !city ? 'Por IP' : 'Por ciudad'};
    }).catch(function (error) {

        console.log(error.response);

        retorno =  {lat : -1, lon : -1, city : ciudad, metodo : !city ? 'Por IP' : 'Por ciudad'};
    });
    return retorno ;
}


const getLugarLatlong = async(dir, claveAccion) => {
    let ubicacion = await getLatLong(dir);
    let retorno = {};
    const instance = axios.create({
        baseURL: encodeURI(urls[claveAccion] + `lat=${ubicacion.lat}&lon=${ubicacion.lon}9&appid=${api}&lang=es&units=metric`)
    });

    const resp = await instance.get();

    if (resp.data) {
        
        if (claveAccion=='current') {
            retorno = {
                resultado : 'OK',
                ciudad : resp.data.name,
                long: resp.data.coord.lon,
                lat: resp.data.coord.lat,
                tiempo: resp.data.weather[0].description,
                temp: resp.data.main.temp,
                minima: resp.data.main.temp_min,
                maxima: resp.data.main.temp_max,
                metodo : ubicacion.metodo
            };
        } else if ('fiveDays') {
            let dias = [];
            dias.push(
                    {resultado : 'OK' ,
                       metodo : ubicacion.metodo,
                       ciudad : resp.data.city.name,
                       lat : resp.data.city.coord.lat,
                       lot : resp.data.city.coord.lon,
                       pais : resp.data.city.country
                    });
            resp.data.list.forEach((pronostico)=> {
                    
                    dias.push({
                        tiempo: pronostico.weather[0].description,
                        temp: pronostico.main.temp,
                        minima: pronostico.main.temp_min,
                        maxima: pronostico.main.temp_max,
                        fecha : pronostico.dt_txt
                    });

            });
            retorno = dias;
        }
        return retorno;
    } else {
        throw new Error('Error en la llamada para la ciudad ' + dir);
    }

};

module.exports = {
    getLugarLatlong,
    getLatLong
}
