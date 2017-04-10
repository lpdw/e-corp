'use strict'
const db = require('../database');
const uid = require('uid-safe');

exports.findOneByQuery = query => {
    return db.Users.findOne({
       where: query
    });
};

exports.createUser = user => {
    const model = db.Users.build(user);
    return model.validate()
        .then(err => {
            if (err) {
                return Promise.reject(err);
            }
           // Génération du numéro de compte et du token
           var accountNB=uid.sync(12);
           var token = uid.sync(8);
           // Une fois l'utilisateur enregistré, on lui créé un compte bancaire
           const account = db.Accounts.build({credit:150,account_nb:accountNB,token:token});

           // On associe le compte à l'utilisateur crée
           model.setAccount(account);
           account.save();
            return model.save();
        })
    ;
};
exports.findById = (id) => {
    return db.Users.findById(id);
};
