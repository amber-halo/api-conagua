# api-conagua
Weather API for querying daily weather information that uses CONAGUA API.

## Description

This API uses CONAGUA API (México) to fetch forecast data to a database to be able to get query results with just a GET request.
It also uses GraphQL, so you can actually get just the data you need.

## Problems with CONAGUA API

CONAGUA is Mexico's national water authority. It has an API that returns forecast data from a lot of México cities.

In order to get this data, as you can read in the [official documentation](https://smn.conagua.gob.mx/es/web-service-api), you need
to make a GET request:

```
GET /webservices/?method=1
```

The response is a compressed .gz file that includes a really large string in JSON format with the forecast data, that includes information 
like the city name, state, day, min and max temperature, clouds description, wind speed, etc.

In this app we use the **method=1**, which data is updated every day. There's another method, and its data is updated every
hour, but this method is not currently working, at least making the GET request by yourself, but it works clicking the button to download
directly in the webpage.

So, if you need to get forecast data from just a city or state, or maybe you jsut want to know clouds description, you actually need
to download the full file, decompress, read it and search for just the data you're looking for. But we are here to make it easier.

With this API, we fetch the every-day updated data to a database, so you can just make a GET request and receive only the data you want
to see. See information below to start working with the API.

## How to use

### Get all data

Get all the data from all cities. This could take a while, around 10 to 15 seconds to response. It returns a 9,800 (aprox.) length array.

```
GET /query/get/
```

### Get data from all cities, but just a few properties

Get data from all cities, but it just returns the specified properties. Just separate them with **&**.

```
GET /query/get/?nmun&nes
```

### Get filtered data

Filter data by state or city name. Currently, you can just filter data by these two properties, separated with **&**.
You can also specifiy which properties you need as response, separated with **&**.

```
GET /query/filter?nes=Puebla&nmun=Coatepec/get/?cc&nes&nmun
```

If you want to filter the data, and also you need to get all properties, just don't specify anything next to /get/.

```
GET /query/filter?nes=Puebla&nmun=Coatepec/get/
```

## Available properties

- cc: String
- desciel: String
- dh: String
- dirvienc: String
- dirvieng: String
- dloc: String
- ides: String
- idmun: String
- lat: String
- lon: String
- ndia: String
- nes: String
- nmun: String
- prec: String
- probprec: String
- raf: String
- tmax: String
- tmin: String
- velvien: String

## TODO
- Check node-cron - https://github.com/ncb000gt/node-cron
- Check node-schedule - https://www.npmjs.com/package/node-schedule
- Fix queries with spaces and accents.

## Methods
get all forecasts
get forecast by nes
get forecast by nmun

/query/filter?nes=Jalisco/get/?cc&nes&nmun&tmax&tmin&desciel

Made by: Saúl Aguilar