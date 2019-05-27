const jwt = require('jsonwebtoken')

const verifyToken = async (req,res,next)=>{
    try{
        if(!req.headers.token) return res.status(401).send({message:'Token não informado'})
        await jwt.verify(req.headers.token, 'shhh')
        next()
    }catch(err){
        return res.status(403).send(err)
    }
}

module.exports = verifyToken