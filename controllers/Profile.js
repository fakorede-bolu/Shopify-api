const handleProfileGet = (req, res, dbs) => {
    dbs.select('*').from('users').where({
        userid: req.params.id
    }).then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('not found')
        }

    })
        .catch(err => res.status(400).json('Error getting user'))

}

const handleProfileUpdate = (req, res, dbs) => {
    const { id } = req.params;
    const { name, age } = req.body.formInput

    dbs('users').where({ userid: id })
    .update({name }).then(response => {
        if (response) {
            res.json('success')
        } else {
            res.status(400).json('Unable to Update')
        }
    })
    .catch(err=> res.status(400).json('errors updating user'))
}

module.exports = {
    handleProfileGet: handleProfileGet,
    handleProfileUpdate: handleProfileUpdate
}