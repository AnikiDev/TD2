var express = require('express');
var User = require('../models/User');
var db = require('../config/db');

var router = express.Router();

function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth');
    }

    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).render('error', {
            message: 'Accès refusé',
            error: { status: 403 }
        });
    }

    next();
}

router.get('/users', requireAuth, requireAdmin, async function(req, res, next) {
    try {
        if (!db.isDatabaseAvailable()) {
            return res.status(503).render('error', {
                message: 'Base de données indisponible',
                error: { status: 503 }
            });
        }

        var users = await User.find({}, {
            username: 1,
            email: 1,
            isAdmin: 1,
            createdAt: 1
        }).sort({ createdAt: -1 });

        res.render('pages/admin-users', {
            title: 'Administration - Utilisateurs',
            users: users
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
