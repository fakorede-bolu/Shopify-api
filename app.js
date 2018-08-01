const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');



const app = express();
app.use(bodyParser.json()); 
app.use(cors());


const dbs = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'boluwatife',
        database: 'budget'
    }
});

let totalInc = 0;
let totalExp = 0;

// -------- Register ------------------
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    dbs.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name:  name
                    }).then(user => {
                        console.log(user[0]);
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
})

// ------SignIn Api --------------
app.post('/signin', (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json('incorrect login details');
    }
    dbs.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

            if (isValid) {
                return dbs.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get users'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
})



//-------------Incomearrays Api------------------
app.post('/incomearrays', (req, res) => {
    const {userid} = req.body;
    dbs('incomeitem').where('userid', '=', userid).select('*')
    .then(incomearrays => {
        res.json(incomearrays)
        }).catch(err => res.status(400).json('cannot retrieve the income arrays'))
    
})


//-------------Expensearrays Api------------------
app.post('/expensearrays', (req, res) => {
    const { userid } = req.body;
    dbs('expenseitem').where('userid', '=', userid).select('*')
        .then(expensearrays => {
            res.json(expensearrays)
        }).catch(err => res.status(400).json('cannot retrieve the expense arrays'))

})




//---------AddIncItem api---------------
app.post('/incitem', (req, res) => {
    const {userid, incid, type, value, description} = req.body;

        dbs('incomeitem').returning('*')
            .insert({
                userid: userid,
                incid: incid,
                type: type,
                value: value,
                description: description
            }).into('incomeitem').then(item => {
                res.json(item[0])
            }).catch(err => res.status(400).json('add income error'))
     
})

//---------AddExpItem api---------------
app.post('/expitem', (req, res) => {
    const { userid, expid, type, value, description, percentage } = req.body;
    
    dbs('expenseitem').returning('*')
        .insert({
            userid: userid,
            expid: expid,
            type: type,
            value: value,
            description: description,
            percentage: percentage
        }).into('expenseitem').then(item => {
            res.json(item[0])
        })
})

// ---------Income Api--------------
app.post('/income', (req, res) => {
    const {userid} = req.body;
    dbs('incomeitem').where('userid', '=', userid).select('value')
    .then(response => {
        const val = response.reduce((acc, value) => {
            return parseInt(value.value) + acc
        }, 0)
        dbs('users')
            .where('userid', '=', userid).returning('totalincome')
            .update({
                totalincome: val
            }).then(totalincome => {
                console.log(totalincome);
                res.json(parseInt(totalincome[0]))
            }).catch(err => res.status(400).json('income update error'))
        
    })
})

// ---------Expense Api------------------
app.post('/expense', (req, res) => {
    const { userid } = req.body;
    dbs('expenseitem').where('userid', '=', userid).select('value')
        .then(response => {
            const val = response.reduce((acc, value) => {
                return parseInt(value.value) + acc
            }, 0)
            dbs('users')
                .where('userid', '=', userid).returning('totalexpense')
                .update({
                    totalexpense: val
                }).then(totalexpense => {
                    console.log(totalexpense);
                    res.json(parseInt(totalexpense[0]))
                }).catch(err => res.status(400).json('expense update error'))

        })
})

// ---------DeleteInc Api----------------
app.post('/incdelete', (req, res) => {
    const { id } = req.body;
    dbs('incomeitem').where('id', '=', id).returning('value')
        .del().then(value => {
            totalInc = totalInc - value[0];
            res.json(totalInc)
        }).catch(err => res.status(400).json('income delete error'))
})

// ---------DeleteExp Api------------
app.post('/expdelete', (req, res) => {
    const { id } = req.body;
    dbs('expenseitem').where('id', '=', id).returning('value')
        .del().then(value => {
            totalExp = totalExp - value[0];
            res.json(totalExp)
        }).catch(err => res.status(400).json('expense delete error'))
})

app.listen(8080, () => {
    console.log('app is listening');
})



// register ----

//i want to get the emmail, and password, nd name and send back, the 
// details