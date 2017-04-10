var express = require('express');
var router = express.Router();
const TransactionsService = require('../services/transactionsService');
const AccountsService = require('../services/accountsService');
const _ = require("lodash");

/* Récupère toutes les transactions de l'utilisateur en cours */
router.get('/', function(req, res, next) {
    // Current logged user
    const user = req.user;
    TransactionsService.findAll(user.id).then(transactions => {
        if (!transactions) {
            return res.status(404).send({err: `No transactions found`});
        }
        if (req.accepts('text/html')) {
          // on récupère le payeur et le bénéficiaire
            return res.render('transactions', {transactions: transactions,user:user});
        }
    });
});
/* Récupère le formulaire de nouvelle transaction*/
router.get('/add', (req, res) => {
    if (!req.accepts('text/html')) {
        return res.statut(404).send({err: "Not valid type for asked ressource"});
    } else {
        const user = req.user;
        AccountsService.findOneByUser(user).then(account => {
            if (!account) {
                return res.status(404).send({err: `No account found`});
            }
            if (req.accepts('text/html')) {
                return res.render('new_transaction', {account: account});

            }
        });
    }
});
/* Récupère le détail d'une transaction via son id */
router.get('/:id', (req, res) => {
    if (!req.accepts('text/html') && !req.accepts('application/json')) {
        return res.status(406).send({err: 'Not valid type for asked resource'});
    }
    TransactionsService.findById(req.params.id).then(transaction => {
        if (!transaction) {
            return res.status(404).send({err: `transaction ${req.params.id} not found`});
        }
        if (req.accepts('text/html')) {
            return res.render('transaction', {transaction: transaction});
        }
        if (req.accepts('application/json')) {
            return res.status(200).send(transaction);
        }
    });

});

/* Modifier une transaction */
router.put('/:id', (req, res) => {
  if (!req.accepts('text/html') || !req.accepts('application/json')) {
      return res.status(406).send({err: 'Not valid type for asked resource'});
  }
    return TransactionsService.update(req.body, req.params.id)
        .then(transaction => {
          // En cas d'annulation de la transaction on annule le débitage du payeur
          if(req.body.status==0){
            TransactionsService.findById(req.params.id).then( transaction => {
              // On récupère le payeur
              transaction.getPayer().then( payer => {
                AccountsService.creditAccount(payer, transaction.amount);
                if (req.is('text/html')) {
                return res.redirect(req.params.id);
                }
                if (req.is('application/json')) {
                    return res.status(200).send(JSON.stringify({status:1}));
                }
              });

            });
          }else if(req.body.status==2){
            TransactionsService.findById(req.params.id).then( transaction => {
              // En cas de validation de la transaction on credite le destinataire
              // On récupère le bénéficiaire
              transaction.getBeneficiary().then( beneficiary => {
              AccountsService.creditAccount(beneficiary, transaction.amount);
              if (req.is('text/html')) {
                return res.redirect(req.params.id);
              }
              if (req.is('application/json')) {
                  return res.status(200).send(JSON.stringify({status:1}));
              }
            });

          });
        }

        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// Validation des données du formulaires de création d'une transaction

const bodyVerificator = (req, res, next) => {
    if (req.body.beneficiary && req.body.payer && req.body.token && req.body.amount && req.body.type) {
        return next();
    }
    const attributes = _.keys(req.body);
    const mandatoryAttributes = [
        'payer',
        'token',
        'beneficiary',
        'amount',
        'message',
        'status',
        'type'
    ];
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
    AccountsService.isPayerExist(req.body.payer, req.body.token).then(payer_account => {
        AccountsService.isBeneficiaryExist(req.body.beneficiary).then(beneficiary_account => {
          //Si deux comptes existent on vérifie que payer a assez d'argent

          if(payer_account.credit>=req.body.amount){
            // Si oui on effectue la transaction
            TransactionsService.create({
                amount: req.body.amount,
                type: req.body.type,
                message: req.body.message,
                status: req.body.status
            }).then(transaction => {
              // Si la transaction est correctement créée on l'associe aux comptes payeur/bénéficiaire
              transaction.setPayer(payer_account);
              transaction.setBeneficiary(beneficiary_account);

                // Si la transaction est créée, selon son status on effectue le transfert de l'argent
                if (req.body.status == 1) {
                    AccountsService.debitAccount(payer_account, req.body.amount);
                } else if (req.body.status == 2) {
                    AccountsService.debitAccount(payer_account, req.body.amount);
                    AccountsService.creditAccount(beneficiary_account, req.body.amount);
                }
                if (req.is('application/x-www-form-urlencoded')) {
                    return res.redirect('transactions');
                }
                if (req.is('application/json')) {
                    return res.status(200).send(JSON.stringify({statut: 1, transaction_id: transaction.id}));
                }
            }).catch(err => {
                console.log(err);
                next(err);

            });
          }else{
            if (req.is('application/x-www-form-urlencoded')) {
                return res.redirect('transactions');
            }
            if (req.is('application/json')) {
                return res.status(403).send(JSON.stringify({statut: 2, err:"Il n'y a pas assez d'argent sur le compte."}));
            }
          }

        }).catch(err => {
            console.log(err);
            next(err);

        });
    }).catch(err => {
        console.log(err);
        next(err);

    });

});

module.exports = router;
