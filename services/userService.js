'use strict'
const db = require('../database');
const uid = require('uid-safe')

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
           const accountNB=uid.sync(12);
           const token = uid.sync(8);
           // Une fois l'utilisateur enregistré, on lui créé un compte bancaire
           const account = db.Accounts.build({credit:3000, user_id:model._id,account_nb:accountNB,token:token}).save();

            return model.save();
        })
    ;
};
