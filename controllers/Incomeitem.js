const handleIncomeitem = (req, res, dbs) => {
    const { userid, incid, type, value, description } = req.body;

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
}

module.exports = {
    handleIncomeitem: handleIncomeitem
}