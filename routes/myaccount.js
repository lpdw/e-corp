var express = require('express');
var router = express.Router();
const AccountsService = require('../services/accountsService');

/* GET my account page. */
router.get('/', function(req, res, next) {
  // Current logged user
  const user = req.user;
  AccountsService.findOneByQuery(user._id)
    .then(account => {
        if (!account) {
            return res.status(404).send({
                err: `Account for ${user.firstname} ${user.lastname} not found`
            });
        }
        if (req.accepts('text/html')) {
            return res.render('myaccount', {
              user:user,
                account: account
            });
        }
    });
});

module.exports = router;
