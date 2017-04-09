var express = require('express');
var router = express.Router();
const TransactionsService = require('../services/transactionsService');
const AccountsService = require('../services/accountsService');
const _ = require("lodash");

/* GET all current user transactions page. */
router.get('/', function(req, res, next) {
    // Current logged user
    const user = req.user;
    TransactionsService.findAll(user._id)
        .then(transactions => {
            if (!transactions) {
                return res.status(404).send({
                    err: `No transactions found`
                });
            }
            if (req.accepts('text/html')) {
                return res.render('transactions', {
                    transactions: transactions
                });
            }
        });
});

router.get('/add', (req, res) => {
    if (!req.accepts('text/html')) {
        return res.statut(404).send({
            err: "Not valid type for asked ressource"
        });
    } else {
      const user = req.user;
      AccountsService.findOneByUser(user).then(account => {
          if (!account) {
              return res.status(404).send({
                  err: `No account found`
              });
          }
          if (req.accepts('text/html')) {
            return res.render('new_transaction',{account:account});

          }
      });
    }
});
router.get('/:id', (req, res) => {
    if (!req.accepts('text/html') && !req.accepts('application/json')) {
        return res.status(406).send({
            err: 'Not valid type for asked resource'
        });
    }
    TransactionsService.findById(req.params.id)
        .then(transaction => {
            if (!transaction) {
                return res.status(404).send({
                    err: `transaction ${req.params.id} not found`
                });
            }
            if (req.accepts('text/html')) {
                return res.render('transaction', {
                    transaction: transaction
                });
            }
            if (req.accepts('application/json')) {
                return res.status(200).send(transaction);
            }
        });

});



// Validation des données du formulaires de création d'une transaction

const bodyVerificator = (req, res, next) => {
    if (req.body.beneficiary && req.body.payer && req.body.token && req.body.amount && req.body.message && req.body.type) {
        return next();
    }
    const attributes = _.keys(req.body);
    const mandatoryAttributes = ['payer','token','beneficiary', 'amount','status', 'type'];
    const missingAttributes = _.difference(mandatoryAttributes, attributes);
    const emptyAttributes = _.filter(mandatoryAttributes, key => _.isEmpty(req.body[key]));

    let error = null;
    if (missingAttributes.length) {
        error = new APIError(400, 'Missing mandatory data :' + missingAttributes.toString());
    }
    if (!error && emptyAttributes.length) {
        error = new APIError(400, emptyAttributes.toString() + ' should not be empty');
    }
    if (req.accepts('text/html')) {
        req.session.err = error.message;
        return res.redirect('/');
    }
    return next(error);
};
router.post('/', bodyVerificator, (req, res, next) => {
    if (!req.accepts('application/json') && !req.accepts('text/html')) {
        return next(new APIError(406, 'Not valid type for asked ressource'));
    }
    //1. On vérifie l'existence des comptes et le token
    AccountsService.isPayerExist(req.body.payer,req.body.token).then(payer =>{
      if(payer>0){
        AccountsService.isBeneficiaryExist(req.body.beneficiary).then(beneficiary=>{
          if(beneficiary>0){
            //Si deux comptes existent on effectue la transaction
            const payer_account=AccountsService.findAccountByNumber(req.body.payer);
            const beneficiary_account=AccountsService.findAccountByNumber(req.body.beneficiary);
             TransactionsService.create({amount:req.body.amount,type:req.body.type,message:req.body.message,status:req.body.status},payer_account,beneficiary_account)
                    .then(transaction => {
                      // Si la transaction est créée, selon son status on effectue le transfert de l'argent
                      if(req.body.status==1){
                        AccountsService.debitAccount(payer,amount);
                      }else if(req.body.status==2){
                        AccountsService.debitAccount(payer,amount);
                        AccountsService.creditAccount(beneficiary,amount);
                      }
                      if (req.accepts('text/html')) {
                          return res.redirect('transactions/'+transaction.id);
                      }
                      if (req.accepts('application/json')) {
                          return res.setHeader('Content-Type','application/json').status(200).send(JSON.stringify({statut:1,transaction_id:transaction_id}));
                      }
                    })
                    .catch(err => {
                        console.log(err);
                        next(err);

                    });
          }else{
            res.setHeader('Content-Type','application/json').status(200).send(JSON.stringify({statut:0,message:"Le compte bénéficiaire n'existe pas"}));
          }
        }).catch(err => {
            console.log(err);
            next(err);

        });
      }else{
          return res.setHeader('Content-Type','application/json').status(200).send(JSON.stringify({statut:0,message:"Mauvais identifiants du payeur"}));
      }

    }).catch(err => {
        console.log(err);
        next(err);

    });




});

module.exports = router;
