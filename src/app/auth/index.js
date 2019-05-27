const jwt = require('jsonwebtoken')
const { User }  = require('../models');
const router = require('express').Router()

router.post('', async (req,res)=>{
    try{
        const {email,password} = req.body
        if(!email) return res.status(400).send({message:'Email não informado'})
        else if(!password) return res.status(400).send({message:'Password não informado'})
        else if(!password && !email) return res.status(400).send({message:'Email/Password não informado'})

        const user = await User.findAll({where:{email,password}})
        if(user.length > 0){
            const token = await jwt.sign({id:user[0].id},'shhh',{
                expiresIn: '2m'
            })
            user[0].password = undefined
            return res.status(201).send({user:user[0],token})
        }

        return res.status(400).send({message:'Email/Password inválidos.'})
    }catch(err){
        return res.status(400).send(err)
    }
})

module.exports = app=>{
    app.use('/auth',router)
}