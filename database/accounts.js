'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Accounts', {
       user_id:{
         type: DataTypes.INTEGER,
         validate: {
             notEmpty: {
                 msg: "-> Missing user id "
             }
         }
       },
        account_nb: {
            type: DataTypes.UUID,
            validate: {
                notEmpty: {
                    msg: "-> Missing account number "
                }
            }
        },
        token:{
          type: DataTypes.UUID,
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
        },
        created_at: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: {
                    msg: "-> Missing created at "
                }
            }
        },
        modified_at: {
          type: DataTypes.DATE,
          validate: {
              notEmpty: {
                  msg: "-> Missing modified at"
              }
          }
        },
        id_transaction: {
          type: DataTypes.INTEGER,
          validate: {
              notEmpty: {
                  msg: "-> Missing id transaction"
              }
          }
        }
    });
};
