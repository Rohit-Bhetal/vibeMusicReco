const express = require('express');
const app = express();
const PORT = 3030;
const cors= require('cors');
const locationGetter=require('./middleware/locationGetter');
const weatherGetter=require('./middleware/weatherGetter');
const llmController=require('./controller/llmController')
const test=require('./controller/test');
app.use(cors());

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/',test)
app.get('/recommendation',locationGetter,weatherGetter,llmController);

app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(500).json({
        error:err.data
    });
})
app.listen(PORT,()=>{
    console.log(`Server is Running in Sever Port No:${PORT}`);
});