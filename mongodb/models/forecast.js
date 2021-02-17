const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForecastSchema = new Schema({
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

module.exports = mongoose.model('Forecast', ForecastSchema);