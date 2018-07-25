const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json()); 
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'john',
            password: 'cookies',
            email: 'john@gmail.com',
            totalBudget: 0,
            totalIncome: 0,
            totalExpense: 0,
            allBudget: {
                inc: [],
                exp: []
            }
        }
    ]
}

const db = database.users[0];

app.get('/', (req, res) => {
    res.json(db.allBudget.inc)
})

//---------AddIncItem api---------------
app.post('/incitem', (req, res) => {
    const {id, type, value, description} = req.body;
        
        db.allBudget.inc.push({
            Id: id,
            Type: type,
            Value: value,
            Description: description
        })
    res.json(db.allBudget.inc[db.allBudget.inc.length -1])

})

//---------AddExpItem api---------------
app.post('/expitem', (req, res) => {
    const { id, type, value, description, percentage } = req.body;
    
        db.allBudget.exp.push({
            Id: id,
            Type: type,
            Value: value,
            Description: description,
            Percentage: percentage
        })
    res.json(db.allBudget.exp[db.allBudget.exp.length - 1])

})

// ---------Income Api--------------
app.post('/income', (req, res) => {
    const {type, description, value} = req.body;
    if (type == 'inc' && description !== '' && value !== '' ) {
        let itemVal = 0;
         db.allBudget.inc.map((item) => {
            return (itemVal += item.Value)
        })
        console.log(itemVal);
        res.json(db.totalIncome = itemVal);
    }
})

// ---------Expense Api------------------
app.post('/expense', (req, res) => {
    const { type, description, value } = req.body;
    if (type == 'exp' && description !== '' && value !== '' ) {
        let itemVal = 0;
         db.allBudget.exp.map((item) => {
            return (itemVal += item.Value)
        })
        console.log(itemVal);
        res.json(db.totalExpense = itemVal);
    }
})

// ------------TotalBudget Api----------------
app.post('/total', (req, res) => {
    
    if (db.totalIncome !== 0) {
        db.totalBudget = db.totalIncome - db.totalExpense
        res.json(db.totalBudget);
    } else {
        db.totalBudget = db.totalExpense
        res.json(db.totalBudget);
    }
    
})

// ---------DeleteInc Api----------------
app.post('/incdelete', (req, res) => {
    const { id, value } = req.body;
        db.allBudget.inc.splice(id, 1)
    totals = db.totalIncome - value
        res.json(totals)

})

// ---------DeleteExp Api------------
app.post('/expdelete', (req, res) => {
    const { id } = req.body;
    db.allBudget.exp.splice(id, 1)
    res.json(db.allBudget.inc)

})

app.listen(8080, () => {
    console.log('app is listening');
})