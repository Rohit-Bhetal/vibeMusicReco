// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config();
const llmController=async(req,res)=>{
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Recommend me song based on the location , time :${JSON.stringify(req.locationTime)} and weather:${JSON.stringify(req.weather)}`;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    const recommendation = result.response.text();
    res.json({
        songRecommmendation: recommendation
    });

}
module.exports=llmController;