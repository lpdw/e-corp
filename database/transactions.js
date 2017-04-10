'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Transactions', {
        amount:{
          type: DataTypes.DOUBLE,
          validate: {
              notEmpty: {
                  msg: "-> Missing amount "
              }
          }
        },
        type: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: "-> Missing type of transaction"
                }
            }
        },
        message: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: "-> Missing status of transaction"
                }
            }
        },

    });
};
