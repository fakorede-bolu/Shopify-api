const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex')


const app = express();
app.use(bodyParser.json()); 
app.use(cors());

// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'john',
//             password: 'cookies',
//             email: 'john@gmail.com',
//             totalBudget: 0,
//             totalIncome: 0,
//             totalExpense: 0,
//             allBudget: {
//                 inc: [],
//                 exp: []
//             } 
//         }
//     ]
// }

const dbs = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'boluwatife',
        database: 'budget'
    }
});


// const db = database.users[0];

let totalInc = 0;
let totalExp = 0;

app.get('/', (req, res) => {
    res.json(db.allBudget.inc)
})

// -------- Register ------------------
app.post('/register', (req, res) => {
    const { email, name } = req.body;
    dbs('users')
        .returning('*')
        .insert({
            email: email,
            name: name
        }).then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('email already exists'))
})

//---------AddIncItem api---------------
app.post('/incitem', (req, res) => {
    const {id, type, value, description} = req.body;
        dbs('incomeitem').returning('*')
        .insert({
            id: id,
            type: type,
            value: value,
            description: description
        }).then(item => {
            totalInc = totalInc + parseInt(item[0].value);
            res.json(item[0])
            }).catch(err => res.status(400).json('add income error'))
})

//---------AddExpItem api---------------
app.post('/expitem', (req, res) => {
    const { id, type, value, description, percentage } = req.body;
    
    dbs('expenseitem').returning('*')
        .insert({
            id: id,
            type: type,
            value: value,
            description: description
        }).then(item => {
            res.json(item[0])
        }).catch(err => res.status(400).json('add expense error'))
})

// ---------Income Api--------------
app.post('/income', (req, res) => {
    const {id, type, description, value} = req.body;
    if (type == 'inc' && description !== '' && value !== '' ) {
        dbs('users')
            .where('id', '=', id).returning('totalincome')
            .update({
                totalincome: totalInc
            }).then(totalincome => {
                res.json(totalincome[0])
            }).catch(err => res.status(400).json('income update error'))
    }
})

// ---------Expense Api------------------
app.post('/expense', (req, res) => {
    const { type, description, value } = req.body;
    if (type == 'exp' && description !== '' && value !== '') {
        dbs('users')
            .where('id', '=', id).returning('totalexpense')
            .update({
                totalexpense: totalExp
            }).then(totalexpense => {
                res.json(totalexpense[0])
            }).catch(err => res.status(400).json('expense update error'))
    }
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