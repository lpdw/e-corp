const router = require('express').Router();
const _ = require("lodash");
const passport = require('passport');

router.get('/', (req, res) => {
   const err = (req.session.err) ? req.session.err : null;
   if (req.accepts('text/html')) {
       return res.render('login', {err});
   }
   next(new APIError(406, 'Not valid type for asked ressource'));
});

router.post('/',
   passport.authenticate('local', {
       successRedirect: '/',
       failureRedirect: '/login',
       failureFlash: true
   })
);

module.exports = router;
