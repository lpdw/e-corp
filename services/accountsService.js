'use strict'
const db = require('../database');

exports.findOneByQuery = query => {
    return db.Accounts.findOne({
       where: query
    });
};

exports.createAccount = account => {
    const model = db.Account.build(account);
    return model.validate()
        .then(err => {
            if (err) {
                return Promise.reject(err);
            }
            return model.save();
        })
    ;
};
