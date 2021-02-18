const pako = require('pako');
const bent = require('bent');

const Forecast = require('../mongodb/models/forecast');

const getData = async function() {
    const getStream = bent('https://smn.conagua.gob.mx');
    try {
        let stream = await getStream('/webservices/?method=1');
        if (stream.statusCode === 200) {
            const buffer = await stream.arrayBuffer();
            let data = pako.inflate(new Uint8Array(buffer), { to: 'string' });
            let jsonData = JSON.parse(data);
            console.log(jsonData.length);

            Forecast.insertMany(jsonData, function(err) {
                if (err) {
                    throw err;
                }
            });
            console.log('Success inserting data');
        }
    } catch (error) {
        throw error;
    }
}

const removeData = function() {
    Forecast.deleteMany({}, (err) => {
        if (err) {
            throw err;
        }
        console.log('Success deleting data');
    });
}

module.exports.getData = getData;
module.exports.removeData = removeData;