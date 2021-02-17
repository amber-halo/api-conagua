require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const pako = require('pako');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');

const PORT = process.env.PORT || 3000;
const MBD_USER = process.env.MONGODB_USER;
const MDB_PASSWORD = process.env.MONGODB_PASSWORD;
const MDB_DB = process.env.MONGODB_DB;

const graphQLSchema = require('./graphql/schema/schema')
const Forecast = require('./mongodb/models/forecast');
const rootValues = require('./graphql/resolvers/forecast');

const querys = require('./routes/query');

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
    app.listen(3000, () => console.log(`Listening at port ${PORT}`));
    // getData();
})
.catch(err => {
    throw(err);
});

app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue: rootValues,
    graphiql: true
}));

async function getData() {
    const getStream = bent('https://smn.conagua.gob.mx');
    try {
        // let buffer = await getBuffer('https://smn.conagua.gob.mx/webservices/?method=1');   

        let stream = await getStream('/webservices/?method=1');
        if (stream.statusCode === 200) {
            const buffer = await stream.arrayBuffer();
            // console.log(buffer.length);

            let data = pako.inflate(new Uint8Array(buffer), { to: 'string' });
            // console.log(data.length);

            let jsonData = JSON.parse(data);
            console.log(jsonData.length);

            Forecast.insertMany(jsonData, function(err) {
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

app.get('/', async (req, res) => {
    res.render('index.html');
});

app.use('/query', querys);

// app.listen(3000, () => console.log(`Listening at port ${PORT}`));