require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const cron = require('node-cron');

const PORT = process.env.PORT || 3000;
const MBD_USER = process.env.MONGODB_USER;
const MDB_PASSWORD = process.env.MONGODB_PASSWORD;
const MDB_DB = process.env.MONGODB_DB;

const graphQLSchema = require('./graphql/schema/schema')
const rootValues = require('./graphql/resolvers/forecast');

const querys = require('./routes/query');

const getData = require('./utils/data').getData;
const removeData = require('./utils/data').removeData;

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(helmet());
app.use(cors());
app.use(morgan('common'))
app.use(express.static('public'));

mongoose.connect(`mongodb+srv://${MBD_USER}:${MDB_PASSWORD}@cluster0.0aw1j.mongodb.net/${MDB_DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => {
    console.log('Success connecting to database');
    app.listen(PORT, () => console.log(`Listening at port ${PORT}`));

    cron.schedule('0 0 * * *', () => {
        console.log('running a task at 00:00, at ' + new Date(Date.now()));
        removeData();
        getData();
    });
})
.catch(err => {
    throw(err);
});

app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue: rootValues,
    graphiql: false
}));

app.get('/', async (req, res) => {
    res.render('index.html');
});

app.use('/query', querys);