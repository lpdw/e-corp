'use strict'
const db = require('../database');
exports.findAll = (user) => {
    return db.Transactions.findAll({
        where: {
            $or: [{
                    payer: user
                },
                {
                    beneficiary: user
                }
            ]
        }
    });
};
exports.create = (transaction, payer, beneficiary) => {
    const model = db.Transactions.build(transaction);
    return model.validate()
        .then(err => {
            if (err) {
                return Promise.reject(err);
            }
            // Si la transaction est correctement créée on l'associe aux comptes payeur/bénéficiaire

            // On associe le compte à l'utilisateur crée
            model.setPayer(payer);
            model.setBeneficiary(beneficiary);
            return model.save();
        });
};
exports.findById = (id) => {
    return db.Transactions.findById(id);
};
exports.findOneByQuery = query => {
    return db.Transactions.findOne({
        where: query
    });
};
