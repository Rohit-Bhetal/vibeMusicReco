const axios = require('axios').default;
require('dotenv').config();
const requestIp = require('request-ip');

const locationGetter=async(req,res,next)=>{
    const ip=requestIp.getClientIp(req);;
    console.log(ip);
    try{
        const locationResponse= await axios.get(`https://ipinfo.io/${ip}?token=${process.env.IP_TOKEN}`)
        const locationData = locationResponse.data;
        const userTime = req.body.time || new Date().toISOString();
        req.locationTime={
            city:locationData.city,
            region:locationData.region,
            country:locationData.country,
            timezone:locationData.timezone,
            userTime
        };
        console.log(req.locationTime);
        next();
    }catch(error){
        console.error('Location error:', error.message);
        res.status(500).send('Error fetching location or time data');
    }
}
module.exports=locationGetter;