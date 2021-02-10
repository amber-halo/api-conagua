const express = require('express');
const cors = require('cors');
const nunjucks = require('nunjucks');

const PORT = process.env.PORT || 3000;

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.listen(3000, () => console.log(`Listening at port ${PORT}`));