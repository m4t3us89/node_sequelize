const routes = require('express').Router()
const verifyToken = require('../../middlewares/verifyToken')
const multer = require('multer')
const multerConfig = require('../../config/multer')
const { User }  = require('../models');
const fs = require('fs');
const path = require('path')
const aws = require("aws-sdk");

const s3 = new aws.S3();

routes.post('' , multer(multerConfig).single('file') , async (req,res)=>{
    try{
        const {  key } = req.file;
        const {name,password,email} = req.body
        const user = await User.create({
            name,
            password,
            email,
            profile: key
        })
        user.password = undefined
        return res.status(201).send(user)
    }catch(err){
        if( typeof(key) == undefined ){
            if(process.env.AMBIENTE_UPLOAD == 'local')
                await fs.unlink( `${path.resolve(__dirname,  "..",  "..", "..", process.env.DIR_UPLOAD , process.env.DIR_UPLOAD_SUB)}/${req.file.key}` )
            else{
                await s3.deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: key
                })
                .promise()
            }
        }
        return res.status(400).send(err)
    }
})

routes.get('', verifyToken, async (req,res)=>{
    try{
        const users = await User.findAll({ 
            attributes:['id','name','email','profile']
        })
        return res.status(201).send(users)
    }catch(err){
        return res.status(400).send(err)
    }
})

routes.delete('/:id' , verifyToken, async (req,res)=>{
    try{
        const id = req.params.id
        const user = await User.findAll( { attributes:['profile','name','email'],where: {id:id} })
        if(user.length == 0) return res.status(400).send({message:'Usuário não econtrado'})
        
        if(process.env.AMBIENTE_UPLOAD == 'local')
            await fs.unlink( `${path.resolve(__dirname,  "..",  "..", "..", process.env.DIR_UPLOAD , process.env.DIR_UPLOAD_SUB)}/${user[0].profile}` )
        else{
            await s3.deleteObject({
            Bucket: process.env.BUCKET_NAME,
            Key: user[0].profile
            })
            .promise()
        }
        await User.destroy({where: {id:id}})
        return res.status(201).send(user[0])
    }catch(err){
        return res.status(400).send(err)
    }
})

module.exports = app=>{
    app.use('/users' , routes)
}