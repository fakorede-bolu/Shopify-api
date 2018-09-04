const handleExpensetotals = (req, res, dbs) => {
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
}

module.exports = {
    handleExpensetotals: handleExpensetotals
}