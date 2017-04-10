'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Accounts', {
        account_nb: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Missing account number "
                }
            }
        },
        token:{
          type: DataTypes.STRING,
          validate: {
              notEmpty: {
                  msg: "-> Missing token "
              }
          }
        },
        credit: {
            type: DataTypes.DOUBLE,
            validate: {
                notEmpty: {
                    msg: "-> Missing credit"
                }
            }
        }
    });
};
