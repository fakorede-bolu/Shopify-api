const handleExpenseitem = (req, res, dbs) => {
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
}

module.exports ={ 
    handleExpenseitem: handleExpenseitem
}