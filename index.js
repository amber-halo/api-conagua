require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
// const { buildSchema } = require('graphql');
const cors = require('cors');
const bent = require('bent');
const pako = require('pako');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');

const PORT = process.env.PORT || 3000;
const MBD_USER = process.env.MONGODB_USER;
const MDB_PASSWORD = process.env.MONGODB_PASSWORD;
const MDB_DB = process.env.MONGODB_DB;

const graphQLSchema = require('./graphql/schema/schema')

const Schema = mongoose.Schema;

const Forecast = new Schema({
    cc: String,
    desciel: String,
    dh: String,
    dirvienc: String,
    dirvieng: String,
    dloc: String,
    ides: String,
    idmun: String,
    lat: String,
    lon: String,
    ndia: String,
    nes: String,
    nmun: String,
    prec: String,
    probprec: String,
    raf: String,
    tmax: String,
    tmin: String,
    velvien: String
});

var ForecastModel;
var forecastInstance;
var forecastData;

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(cors());
app.use(express.static('public'));

mongoose.connect(`mongodb+srv://${MBD_USER}:${MDB_PASSWORD}@cluster0.0aw1j.mongodb.net/${MDB_DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => {
    console.log('Success');
    ForecastModel = mongoose.model('Forecast', Forecast);
    forecastInstance = new ForecastModel();
    // forecastData = ForecastModel.find({});

    app.listen(3000, () => console.log(`Listening at port ${PORT}`));

    // getData();
    // forecastInstance.cc = 'hello world';
    // forecastInstance.save((err) => {
    //     if (err) {
    //         console.log('ERROR ON SAVING');
    //         return;
    //     }


    // });
    // getData();
})
.catch(err => {
    throw(err);
});

app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue: {
        forecasts: () => {
            // return ForecastModel.find({});
            // return forecastData;

            return ForecastModel.find({  })
            .then(forecasts => {
                return forecasts.map(forecast => {
                    return { ...forecast._doc };
                });
            })
            .catch(err => {
                throw(err);
            });
        },
        search: async ({ filter }) => {
            console.log(filter);
            let result = await ForecastModel.find( filter );
            if (!result) {
                throw new Error('No results found.');
            }
            return result;
        }
    },
    graphiql: true
}));

async function getData() {
    const getStream = bent('https://smn.conagua.gob.mx');
    try {
        // let buffer = await getBuffer('https://smn.conagua.gob.mx/webservices/?method=1');   

        // let db = mongoose.connection;

        let stream = await getStream('/webservices/?method=1');

        if (stream.statusCode === 200) {
            const buffer = await stream.arrayBuffer();
            // console.log(buffer.length);

            let data = pako.inflate(new Uint8Array(buffer), { to: 'string' });
            // console.log(data.length);

            let jsonData = JSON.parse(data);
            console.log(jsonData.length);

            ForecastModel.insertMany(jsonData, function(err) {
                if (err) {
                    console.log('ERROR INSERTING DATA');
                    return;
                }
            });

            console.log('SUCCESS INSERTING DATA!!!');
            // res.sendStatus(200);

        }
    } catch (error) {
        console.log(error);
        // res.sendStatus(500);
    }
}

app.get('/', (req, res) => {
    res.render('index.html');
});

// /query/filter?nes=Oaxaca&nmun=X
// /query/filter?nes=Oaxaca&nmun=X/get/?cc&nes&nmun
app.get('/query/filter?', (req, res) => {
    // process url to get query string

    // get full url
    let url = String(req.url);
    let split = url.split('/');
    // console.log(split);

    // get query string for filters and data expected
    let filters = split[2].split('?')[1].split('&');
    let get = split[4].split('?')[1].split('&');

    // console.log(filters);
    // console.log(get);

    if (filters.length > 2) {
        // too many arguments
        throw new Error('Too many argumentes in query string: filter.');
    }

    let jsonString = '';
    for (let i = 0; i < filters.length; i++) {
        let filter = filters[i];
        if (!String(filter).includes('=')) {
            throw new Error('Invalid filter. No argument found.');
        }

        filter = filter.split('=');
        jsonString += `"${filter[0]}":"${filter[1]}"${i < filters.length - 1 ? ',' : ''}`;
    }

    jsonString = `{ ${jsonString} }`;
    // console.log(jsonString);
    let json = JSON.parse(jsonString);
    console.log(json);

    if (!json) {
        throw new Error('Error parsing query string.');
    }

    ForecastModel.find(json)
    .then(forecast => { 
        // console.log(forecast);
        res.json(forecast);
    })
    .catch(err => { throw err });
    // console.log(result);

    // ForecastModel.findMany();

    // res.send(result);
});

// app.listen(3000, () => console.log(`Listening at port ${PORT}`));