require('dotenv').config();
const jwt = require('jsonwebtoken');
const redis = require('redis');

// setup Redis:
const redisClient = redis.createClient(process.env.REDIS_URI)

const handleRegister = (req, res, dbs, bcrypt) => {
    if (!req.body.email || !req.body.name || !req.body.password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(req.body.password);
    
    dbs.transaction(trx => {
        trx.insert({
            hash: hash,
            email: req.body.email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: req.body.name
                    }).then(user => {
                       res.json(createSessions(user[0]))
                        
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
}

const signToken = (email) => {
    const jwtPayload = { email };

    return jwt.sign(jwtPayload, process.env.TOKEN, { expiresIn: '2 days' });
}

const setToken = (token, userid) => {
    return Promise.resolve(redisClient.set(token, userid))
}

const createSessions = (user) => {
    const { email, userid } = user;
    const token = signToken(email);
    setToken(token, userid);
    return { success: 'true', userId: userid, token }
}


module.exports = {
    handleRegister: handleRegister
}