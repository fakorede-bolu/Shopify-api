const handleIncometotals = (req, res, dbs) => {
    const { userid } = req.body;
    dbs('incomeitem').where('userid', '=', userid).select('value')
        .then(response => {
            const val = response.reduce((acc, value) => {
                return parseInt(value.value) + acc
            }, 0)
            console.log(val);
            dbs('users')
                .where('userid', '=', userid).returning('totalincome')
                .update({
                    totalincome: val
                }).then(totalincome => {
                   
                    res.json(parseInt(totalincome[0]))
                }).catch(err => res.status(400).json('income update error'))

        })
}

module.exports = {
    handleIncometotals: handleIncometotals
}