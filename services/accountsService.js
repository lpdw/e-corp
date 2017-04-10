'use strict'
const db = require('../database');

exports.findOneByQuery = query => {
    return db.Accounts.findOne({where: query});
};

exports.createAccount = account => {
    const model = db.Accounts.build(account);
    return model.validate().then(err => {
        if (err) {
            return Promise.reject(err);
        }
        return model.save();
    });
};
exports.findOneByUser = (user) => {
    return db.Accounts.findOne({
        where: {
            UserId: user.id
        }
    });
};

exports.debitAccount = (account, amount) => {
    return db.Accounts.update({
        credit: parseFloat(account.credit - amount)
    }, {
        where: {
            id: account.id

        }
    });
}
exports.creditAccount = (account, amount) => {
    return db.Accounts.update({
        credit: parseFloat(account.credit + amount)
    }, {
        where: {
            id: account.id

        }
    });
}
exports.creditAccountByID = (accountID, amount) => {
    return db.Accounts.findById(accountID).then(
      account => {
        return db.Accounts.update({
            credit: parseFloat(account.credit) + parseFloat(amount)
        }, {
            where: {
                id: accountID

            }
        });
      }
    )

}
exports.isPayerExist = (payer, token) => {
    return db.Accounts.findOne({
        where: {
            account_nb: payer,
            token: token
        }
    });
}
exports.isBeneficiaryExist = (beneficiary) => {
    return db.Accounts.findOne({
        where: {
            account_nb: beneficiary
        }
    });
}
exports.findAccountByNumber = (account_number) => {
    return db.Accounts.findOne({
        where: {
            account_nb: account_number
        }
    })
}
