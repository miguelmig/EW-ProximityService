// module to support REST APIs developement.
const express = require('express');
const bodyParser = require('body-parser');
// module to support JSON files parsing and formate confirmation. Used in the POST  request.
const Joi = require('joi');
process.title = "Proximity Service"
const app = express();
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
    
app.use(bodyParser.json())

const NEARBY_DISTANCE_METERS = 20;
app.get('/proximity/nearby', (req, res) => {
    console.log("Proximity check:")
    console.dir(req.body)
    const schema = {
        lat1: Joi.number().precision(8).required(),
        lon1: Joi.number().precision(8).required(),
        lat2: Joi.number().precision(8).required(),
        lon2: Joi.number().precision(8).required(),
    };
    const result = Joi.validate(req.body, schema);
    if(result.error)
    {
        return res.status(400).send(result.error.details[0].message);
    }

    lat1 = req.body.lat1;
    lon1 = req.body.lon1;
    lat2 = req.body.lat2;
    lon2 = req.body.lon2;
    const distance = computeDistance({lat: lat1, long: lon1}, {lat: lat2, long: lon2});
    console.log("Nearby? " + (distance <= NEARBY_DISTANCE_METERS));
    res.status(200).send({"nearby": distance <= NEARBY_DISTANCE_METERS});
});

// Setting PORT to listen to incoming requests or by default use port 3000
// Take not that the string in the argument of log is a "back tick" to embedded variable.

const port = process.env.PORT || 3005;

app.listen(port, (req, res) => { 
    console.log(`Listen on port ...${port}`);
});


function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function computeDistance(gps1, gps2) {
    lat1 = gps1.lat;
    lon1 = gps1.long;
    lat2 = gps2.lat;
    lon2 = gps2.long;

    // TODO: Compute distance between 2 gps coordinates
    var R = 6371e3; // metres
    var phi1 = degreesToRadians(lat1);
    var phi2 = degreesToRadians(lat2);
    var deltaPhi = degreesToRadians((lat2-lat1));
    var deltaLambda = degreesToRadians((lon2-lon1));

    var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;
}
