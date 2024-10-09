const axios = require('axios').default;
require('dotenv').config();

const weatherGetter = async(req,res,next)=>{
    
    try {
        const city=req.locationTime.city;
    const weather =axios.get(`https://api.tomorrow.io/v4/weather/forecast?location=${city}&apikey=${process.env.WEATHER_API_TOKEN}`);
    req.weather=weather.data;
    next();
    } catch (error) {
        console.error('Weather error:', error.message);
        res.status(500).send('Error fetching Weather data');
    }

}

module.exports=weatherGetter