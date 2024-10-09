const User = require('../models/User');

const bcyrpt = require('bcrypt');

const jwt= require('jsonwebtoken');
require('dotenv').config();

const createNewUser = async(req,res)=>{
    const {name,email,password}=req.body;

    if(!name,!email,!password){
        return res.status(400).json({
            error:'Missing fields'
        })
    }
    try{
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
        }
        const accessToken = jwt.sign(
            {
                "username":name
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:'1d'
            }
        );
        const hashedPassword = await bcyrpt.hash(password,10)
        const result = await User.create({
            name:name,
            email:email,
            password:hashedPassword,
            accessToken:accessToken
        });
        res.cookie('jwt',accessToken,{httpOnly: true,sameSite:'None',secure:true});
        res.status(201).json({
            message:'User created successfully',
            user:result
        })
    }catch(error){
        console.error(error);
        res.status(500).json({
            error:'Server error'
        })
    }
}

const handleLogin = async(req,res)=>{
    const {user,pwd} = req.body;
    if(!user||!pwd) return res.status(400).json({
        'message':'Username and password are required.'
    });
    const foundUser=await User.findOne({
        username:user
    }).exec();
    if(!foundUser) return res.status(404).json({
        'error':'Username not found'
    });
    const match=await bcyrpt.compare(pwd,foundUser.password);
    if(match){
        const accessToken = jwt.sign(
            {
                "username":foundUser.username
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:'1d'
            }
        );
        foundUser.accessToken=accessToken;
        const result = await foundUser.save();
        console.log(result);
        res.cookie('jwt',accessToken,{httpOnly: true,sameSite:'None',secure:true});
        res.json({accessToken});
    }else{
        res.sendStatus(401);
    }
    
}
module.exports = {handleLogin,createNewUser};