var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('pages/index', { title: "Accueil" });
});

router.get('/calcul', (req, res) => {
    res.render('pages/calculs', {
        title: "Calcul",
        layout: "layouts/main", // <--- indique le layout global
        error: null
    });
});


router.get('/juste-prix', function(req, res, next) {
    res.render('pages/juste-prix', { title: "Jeu du Juste Prix" });
});

module.exports = router;
