'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Users', {
        typeofAccount: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: "-> Missing type of usr"
                }
            }
        },
        company: {
            type: DataTypes.STRING,
        },
        firstname: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Missing firstname"
                }
            }
        },
        lastname: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Missing lastname"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Missing email"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Missing password"
                }
            }
        }
    });
};
