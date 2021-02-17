const express = require('express');
const router = express.Router();
const bent = require('bent');

const url = `http://localhost:${process.env.PORT || 3000}/`;
const post = bent(url, 'POST', 'json', 200);

const attrsList = 'cc desciel dh dirvienc dirvieng dloc ides idmun lat lon ndia nes nmun prec probprec raf tmax tmin velvien';
const allAttributes = attrsList.split(' ');

const splitURL = function(req, res, next) {
    // get full url
    let url = String(req.url);
    let split = url.split('/');
    // console.log(split);
    req.split = split;
    next();
}

const getJSONString = function(filters) {
    let jsonString = '';
    for (let i = 0; i < filters.length; i++) {
        let filter = filters[i];
        if (!String(filter).includes('=')) {
            throw new Error('Invalid filter. No argument found.');
        }
        filter = filter.split('=');
        jsonString += `${filter[0]}:"${filter[1]}"${i < filters.length - 1 ? ',' : ''}`;
    }
    return jsonString;
}

router.use(splitURL);

router.get('/get/?', async (req, res) => {
    let attrsFromQuery = req.split[2] || '';
    let attrsString = attrsFromQuery != '' ? attrsFromQuery.split('?')[1].split('&') : undefined;
    // console.log(attrsString);

    let attrs = attrsString ? attrsString.join('\n') : allAttributes;
    try {
        const response = await post('graphql', { query: `{ forecasts { ${attrs} } }` } );
        if (response) {
            res.json(response);
        }
    } catch (error) {
        throw error;
    }
});

router.get('/filter?', async (req, res) => {
    let filtersFromQuery = req.split[1] || '';
    let attrsFromQuery = req.split[3] || '';
    let filters = filtersFromQuery.split('?')[1].split('&');
    let attrsString = attrsFromQuery != '' ? attrsFromQuery.split('?')[1].split('&') : undefined;
    // console.log(filters);
    // console.log(attrsString);

    if (filters.length > 2) {
        throw new Error('Too many argumentes in query string: filter.');
    }

    let filtersJSON = getJSONString(filters);
    let attrs = attrsString ? attrsString.join('\n') : allAttributes;
    // console.log(attrs);
    try {
        const response = await post('graphql', { query: `{ search(filter: { ${filtersJSON} }) { ${attrs} } }` } );
        if (response) {
            res.json(response);
        }
    } catch (error) {
        throw error;
    }
});

module.exports = router;