var express = require('express');
var router = express.Router();
const AccountsService = require('../services/accountsService');
const UsersService = require('../services/userService');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/me', function(req, res, next) {
    // Current logged user
    const user = req.user;
    AccountsService.findOneByUser(user)
        .then(account => {
            if (!account) {
                return res.status(404).send({
                    err: `Account for ${user.firstname} ${user.lastname} not found`
                });
            }
            if (req.accepts('text/html')) {
                return res.render('myaccount', {
                    user: user,
                    account: account,
                });
            }
        });
});

router.get('/edit/:id', (req, res) => {
  const err = (req.session.err) ? req.session.err : null;
    if (!req.accepts('text/html')) {
        return res.status(406).send({
            err: 'Not valid type for asked resource'
        });
    }
    UsersService.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    err: `id ${req.params.id} not found`
                });
            }
           AccountsService.findOneByUser(user).then(account=>
           {
             if (req.accepts('text/html')) {
                 return res.render('add_credit', {
                     user: user,
                     account:account,
                     err:err
                 });
             }
           });

        });
});
router.put('/account/:id', (req, res) => {
    return AccountsService.creditAccountByID(req.params.id,req.body.amount)
        .then(account => {
          if (req.accepts('text/html')) {
            return res.redirect('/users/me');
          }
        })
        .catch(err => {
            res.status(500).send(err);
        });
});
module.exports = router;
