'use strict';

const path = require('path');
const Sequelize = require('sequelize');

const url = (process.env.DATABASE_URL || '').match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
const DB_name = url ? url[6] : null;
const user = url ? url[2] : null;
const pwd = url ? url[3] : null;
const protocol = url ? url[1] : null;
const dialect = url ? url[1] : 'sqlite';
const port = url ? url[5] : null;
const host = url ? url[4] : null;
const storage = process.env.DATABASE_STORAGE || 'database.sqlite';

const sequelize = new Sequelize(DB_name, user, pwd, {
    dialect,
    protocol,
    port,
    host,
    omitNull: true,
    storage
});

exports.sequelize = sequelize;

sequelize.sync()
    .then(() => {
        console.log('db loaded');
    });
const Users = sequelize.import(path.join(__dirname, 'users'));

const Accounts = sequelize.import(path.join(__dirname, 'accounts'));
const Transactions = sequelize.import(path.join(__dirname, 'transactions'));
// Définition de la relation One to one Account/User
Accounts.belongsTo(Users,{as :'user'});
Users.hasMany(Transactions, {
    as: 'Payer',
    foreignKey: 'payer'
});
Users.hasMany(Transactions, {
    as: 'Beneficiary',
    foreignKey: 'beneficiary'
});

exports.Users = Users;
exports.Accounts = Accounts;
exports.Transactions = Transactions;
