const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../services/userService');

module.exports.eCorpAPILocalStrategy = () => {
  // Pour se connecter avec l'adresse email, on surcharge le nom du champs 'surname'
  return new LocalStrategy({usernameField: 'email',
    passwordField: 'password'},(username, password, done) => {
       return UserService.findOneByQuery({ email: username })
           .then(user => {
               if (!user) {
                 console.log("Erreur email");
                  return done(null, false, { message: 'Incorrect email.' });
               }
               if (!bcrypt.compareSync(password, user.password)) {
                   return done(null, false, { message: 'Incorrect password.' });
               }
               return done(null, user);
           })
           .catch(err => {
             console.log(err);
               return done(err);
           });
  });
};
