const handleIncomearrays = (req, res, dbs) => {
    const { userid } = req.body;
    dbs('incomeitem').where('userid', '=', userid).select('*')
        .then(incomearrays => {
            res.json(incomearrays)
        }).catch(err => res.status(400).json('cannot retrieve the income arrays'))
}

module.exports = {
    handleIncomearrays: handleIncomearrays
}