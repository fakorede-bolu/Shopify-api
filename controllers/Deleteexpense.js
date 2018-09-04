const handleDeleteexpense = (req, res, dbs) => {
    const { expid, userid } = req.body;
    dbs('expenseitem').returning('value').where({
        userid: userid,
        expid: expid
    }).del().then(response => {
        const delval = response[0];

        dbs('users').where('userid', '=', userid).select('totalexpense')
            .then(response => {

                const oldTotalExpense = response[0].totalexpense;

                const newTotal = oldTotalExpense - delval

                dbs('users').where('userid', '=', userid).returning('totalexpense')
                    .update({
                        totalexpense: newTotal
                    }).then(response => {
                        res.json(response[0])
                    })
            })
    })
}

module.exports = {
    handleDeleteexpense: handleDeleteexpense
}