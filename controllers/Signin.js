require('dotenv').config();
const jwt = require('jsonwebtoken');
const redis = require('redis');

// setup Redis:
const redisClient = redis.createClient(process.env.REDIS_URI)

const handleSignin = (dbs, bcrypt, req, res) => {
    if (!req.body.email || !req.body.password) {
        return Promise.reject('incorrect login details');
    }
    return dbs.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

            if (isValid) {
                return dbs.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => user[0])
                    .catch(err => Promise.reject('unable to get users'))
            } else {
                Promise.reject('wrong credentials')
            }
        })
        .catch(err => Promise.reject('wrong credentials'))
}


const signToken = (email) => {
    const jwtPayload = { email };
    
    return jwt.sign(jwtPayload, process.env.TOKEN, {expiresIn: '2 days'});
}

const setToken = (token, userid) => {
    return Promise.resolve(redisClient.set(token, userid))
}

const createSessions = (user) => {
    const { email, userid } = user;
    const token = signToken(email);
    return setToken(token, userid)
    .then(() => { 
        return {success: 'true', userId: userid, token} 
    }).catch(console.log)
} 
    
const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('Unauthorized')
        } 
        return res.json({userid: reply}) 
    })
}
    const signinAuthentication = (dbs, bcrypt) => ( req, res) => {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenId(req, res) : 
    handleSignin(dbs, bcrypt, req, res).then(
        data => {
            console.log(process.env.TOKEN);
            console.log(data, process.env.TOKEN);
       return data.userid && data.email ?  createSessions(data) 
        : Promise.reject(data)
        
        })
        .then(session => res.json(session))
        .catch(err => res.status(401).json('wrong credentials'))

}

module.exports = {
    signinAuthentication: signinAuthentication,
    redisClient: redisClient
}

// create session request user that contains userid and email
// signtoken needs email to generate the token with jwt
// set token needs token generated from signtoken and saved as a key value store in redis with userid
