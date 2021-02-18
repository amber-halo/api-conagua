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

module.exports.splitURL = splitURL;
module.exports.getJSONString = getJSONString;