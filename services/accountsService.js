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
exports.findOneByUser = (user) => {
    return db.Accounts.findOne({
       where: {
         UserId: user.id
       }
    });
};


exports.debitAccount = (account,amount) => {
  return db.Accounts.update(
  {
      credit: account.credit-amount
  },
  { where:{
    id: account._id

  }
});
}
exports.creditAccount = (account,amount) => {
  return db.Accounts.update(
  {
      credit: account.credit+amount
  },
  { where:{
    id: account._id

  }
});
}
exports.isPayerExist = (payer,token) => {
  return db.Accounts.count({
    where:{
      account_nb : payer,
      token : token
    }
  });
}
exports.isBeneficiaryExist = (beneficiary) => {
  return db.Accounts.count({
    where:{
      account_nb : beneficiary
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
