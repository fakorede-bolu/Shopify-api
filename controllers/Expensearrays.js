const handleExpensearray =  (req, res, dbs) => {
    const { userid } = req.body;
    dbs('expenseitem').where('userid', '=', userid).select('*')
        .then(expensearrays => {
            res.json(expensearrays)
        }).catch(err => res.status(400).json('cannot retrieve the expense arrays'))
}

module.exports = {
    handleExpensearray: handleExpensearray
}