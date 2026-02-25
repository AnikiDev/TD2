var express = require('express');
var router = express.Router();

function normalizeProgramme(programme) {
    return programme === 'monte_carlo' ? 'monte_carlo' : 'prime';
}

function parseInteger(value) {
    var parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

router.get('/', function(req, res) {
    res.render('pages/index', { title: 'Accueil' });
});

router.get('/calcul', function(req, res) {
    res.render('pages/calculs', {
        title: 'Calcul',
        error: null,
        success: null,
        formData: {
            programme: 'prime',
            valeur: '',
            nb_process: ''
        }
    });
});

router.post('/calcul', function(req, res) {
    var programme = normalizeProgramme(req.body.programme);
    var valeur = parseInteger(req.body.valeur);
    var nbProcess = parseInteger(req.body.nb_process);

    var valeurMin = programme === 'monte_carlo' ? 1 : 2;
    var valeurMax = 1000000;
    var processMin = 1;
    var processMax = 8;

    var error = null;

    if (valeur === null || valeur < valeurMin || valeur > valeurMax) {
        error = programme === 'monte_carlo'
            ? 'Le nombre de lancers doit être compris entre 1 et 1000000.'
            : 'La borne maximale doit être comprise entre 2 et 1000000.';
    } else if (nbProcess === null || nbProcess < processMin || nbProcess > processMax) {
        error = 'Le nombre de processus MPI doit être compris entre 1 et 8.';
    }

    res.render('pages/calculs', {
        title: 'Calcul',
        error: error,
        success: error
            ? null
            : 'Votre demande de calcul a été enregistrée (simulation locale).',
        formData: {
            programme: programme,
            valeur: valeur === null ? '' : valeur,
            nb_process: nbProcess === null ? '' : nbProcess
        }
    });
});

router.get('/juste-prix', function(req, res) {
    res.render('pages/juste-prix', { title: 'Jeu du Juste Prix' });
});

module.exports = router;
