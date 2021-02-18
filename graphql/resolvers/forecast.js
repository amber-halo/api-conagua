const Forecast = require('../../mongodb/models/forecast');

module.exports =  {
    forecasts: async () => {
        try {
            const forecasts = await Forecast.find({});
            return forecasts.map(forecast => {
                return { ...forecast._doc };
            });
        } catch (err) {
            throw (err);
        }
    },
    search: async ({ filter }) => {
        // console.log(filter);
        let result = await Forecast.find( filter );
        if (!result) {
            throw new Error('No results found.');
        }
        return result;
    }
}