import express from 'express'
import fetch from 'node-fetch'
import requestIp from 'request-ip'
import { IPinfoWrapper } from "node-ipinfo"
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const ipinfo = new IPinfoWrapper(process.env.IP_INFO_TOKEN);

const getWeatherData = async (city)=>{
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${process.env.OPENWEATHER_API_KEY}`
    console.log(url)
    const response = await fetch(url);
    const weatherData = await response.json();
    return weatherData;
}

const getIP = (req)=>{
    let ip_address = requestIp.getClientIp(req)
    return ip_address
}

const getLocation = async (IP)=>{
    let response = await ipinfo.lookupIp(IP).then((response) => {
        return response
    });

    return response
}

app.get('/api/hello', async function(req, res){
    let clientIP = getIP(req)
    let name = req.query.visitor_name
    let location = await getLocation(clientIP)
    let temperature = await getWeatherData(location.city)
    console.log({temperature})
    res.json({
        client_ip: clientIP,
        location: location.city,
        greeting: `Hello ${name}!, the temperature is ${temperature.main.temp} degrees Celsius in ${location.city}`
     })
})

app.listen(5000, function(){
    console.log(`server listening on port ${5000}`)
})