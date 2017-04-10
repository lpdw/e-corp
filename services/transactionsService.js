'use strict'
const db = require('../database');
exports.findAll = (user) => {
    return db.Transactions.findAll({
        where: {
            $or: [
                {
                    payer: user
                }, {
                    beneficiary: user
                }
            ]
        },
        include: [
            {
                all: true,
                nested: true
            }
        ]
    });
};
exports.create = (transaction, payer, beneficiary) => {
    const model = db.Transactions.build(transaction);
    return model.validate().then(err => {
        if (err) {
            return Promise.reject(err);
        }

        return model.save();
    });
};

// Modification d'une transaction (uniquement son status)
exports.update = (transaction, id) => {
    return db.Transactions.update({
        status: transaction.status
    }, {
        where: {
            id: id

        }
    });
};
exports.findById = (id) => {
    return db.Transactions.findById(id);
};
exports.findOneByQuery = query => {
    return db.Transactions.findOne({where: query});
};
