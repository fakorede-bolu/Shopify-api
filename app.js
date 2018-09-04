const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan')



const register = require('./controllers/Register');
const signin = require('./controllers/Signin');
const incomearrays = require('./controllers/Incomearrays');
const expensearrays = require('./controllers/Expensearrays');
const incomeitem = require('./controllers/Incomeitem');
const expenseitem = require('./controllers/Expenseitem');
const incometotals = require('./controllers/Income');
const expensetotals = require('./controllers/Expense');
const incomedelete = require('./controllers/Deleteincome');
const expensedelete = require('./controllers/Deleteexpense');
const profile = require('./controllers/Profile');
const auth = require('./controllers/Authorization');


const app = express();
app.use(bodyParser.json()); 
app.use(morgan('combined'))
app.use(cors());


// const dbs = knex({
//     client: 'pg',
//     connection: {
//         host: '127.0.0.1',
//         user: 'postgres',
//         password: 'boluwatife',
//         database: 'budget'
//     }
// });

const dbs = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});

app.get('/', (req, res) => {
    res.send('it is working!')
})

// ---------------- Register ------------------
app.post('/register',  (req, res) => { register.handleRegister(req, res, dbs, bcrypt)})

// ---------------SignIn Api -------------------
app.post('/signin', signin.signinAuthentication(dbs, bcrypt))

//-------------Incomearrays Api------------------
app.post('/incomearrays', (req, res) => { incomearrays.handleIncomearrays(req, res, dbs)})


//-------------Expensearrays Api------------------
app.post('/expensearrays', (req, res) => { expensearrays.handleExpensearray(req, res, dbs)})


//---------AddIncItem api---------------
app.post('/incitem', (req, res) => {incomeitem.handleIncomeitem(req, res, dbs)})


//---------AddExpItem api---------------
app.post('/expitem', (req, res) => {expenseitem.handleExpenseitem(req, res, dbs)})

// ---------Income Api--------------
app.post('/income', (req, res) => {incometotals.handleIncometotals(req, res, dbs)})

// ---------Expense Api------------------
app.post('/expense', (req, res) => {expensetotals.handleExpensetotals(req, res, dbs)})

// ---------DeleteInc Api----------------
app.post('/incdelete',  (req, res) => {incomedelete.handleIncomedelete(req, res, dbs)})

// ---------DeleteExp Api------------
app.post('/expdelete', (req, res) => {expensedelete.handleDeleteexpense(req, res, dbs)})

// -------------Profile Api ------------

app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, dbs) })

// -------------Profile Update-----------

app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, dbs) })

app.listen(8080, () => {
    console.log('app is listening on port 8080');
})



