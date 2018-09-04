const handleIncomedelete = (req, res, dbs) => {
    const { incid, userid } = req.body;
    dbs('incomeitem').returning('value').where({
        userid: userid,
        incid: incid
    }).del().then(response => {
        const delval = response[0];

        dbs('users').where('userid', '=', userid).select('totalincome')
            .then(response => {

                const oldTotalIncome = response[0].totalincome;

                const newTotal = oldTotalIncome - delval

                dbs('users').where('userid', '=', userid).returning('totalincome')
                    .update({
                        totalincome: newTotal
                    }).then(response => {
                        res.json(response[0])
                    })
            })
    })

}

module.exports = {
    handleIncomedelete: handleIncomedelete
}