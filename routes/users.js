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
                  user:user,
                    account: account,
                });
            }
        });
});
module.exports = router;
