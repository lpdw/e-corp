'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Transactions', {
      id_transaction: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: {
                msg: "-> Missing id transaction"
            }
        }
      },
      montant: {
        type: DataTypes.FLOAT,
        validate: {
            notEmpty: {
                msg: "-> Missing montant of transaction"
            }
        }
      },
        payer: {
            type: DataTypes.UUID,
            validate: {
                notEmpty: {
                    msg: "-> Missing payer account number "
                }
            }
        },
        beneficiary: {
            type: DataTypes.UUID,
            validate: {
                notEmpty: {
                    msg: "-> Missing beneficiary account number "
                }
            }
        },
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
          }        }
    });
};
