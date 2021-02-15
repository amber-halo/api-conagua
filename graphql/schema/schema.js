const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Forecast {
        _id: ID!
        cc: String!
        desciel: String!
        dh: String!
        dirvienc: String!
        dirvieng: String!
        dloc: String!
        ides: String!
        idmun: String!
        lat: String!
        lon: String!
        ndia: String!
        nes: String!
        nmun: String!
        prec: String!
        probprec: String!
        raf: String!
        tmax: String!
        tmin: String!
        velvien: String
    }

    input Filter {
        nes: String
        nmun: String
    }

    type RootQuery {
        forecasts: [Forecast]
        search(filter: Filter): [Forecast]
    }

    schema {
        query: RootQuery
    }
`);