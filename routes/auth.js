var express = require('express');
var bcrypt = require('bcryptjs');
var User = require('../models/User');
var db = require('../config/db');

var router = express.Router();

function renderAuthPage(res, data) {
    res.render('pages/auth', {
        title: 'Connexion / Inscription',
        activeTab: data.activeTab || 'login',
        error: data.error || null,
        success: data.success || null,
        loginData: data.loginData || { identifier: '' },
        registerData: data.registerData || { username: '', email: '' }
    });
}

router.get('/', function(req, res) {
    if (req.session.user) {
        return res.redirect('/');
    }

    var status = db.getDatabaseStatus();
    renderAuthPage(res, {
        error: status.available ? null : 'Base de données indisponible. Vérifiez la connexion réseau puis réessayez.'
    });
});

router.post('/register', async function(req, res) {
    try {
        if (!db.isDatabaseAvailable()) {
            return renderAuthPage(res, {
                activeTab: 'register',
                error: 'Inscription impossible: base de données indisponible.',
                registerData: {
                    username: (req.body.username || '').trim(),
                    email: (req.body.email || '').trim().toLowerCase()
                }
            });
        }

        var username = (req.body.username || '').trim();
        var email = (req.body.email || '').trim().toLowerCase();
        var password = req.body.password || '';
        var confirmPassword = req.body.confirmPassword || '';

        if (!username || !email || !password || !confirmPassword) {
            return renderAuthPage(res, {
                activeTab: 'register',
                error: 'Tous les champs sont obligatoires pour l\'inscription.',
                registerData: { username: username, email: email }
            });
        }

        if (password.length < 6) {
            return renderAuthPage(res, {
                activeTab: 'register',
                error: 'Le mot de passe doit contenir au moins 6 caractères.',
                registerData: { username: username, email: email }
            });
        }

        if (password !== confirmPassword) {
            return renderAuthPage(res, {
                activeTab: 'register',
                error: 'La confirmation du mot de passe ne correspond pas.',
                registerData: { username: username, email: email }
            });
        }

        var existingUser = await User.findOne({
            $or: [{ username: username }, { email: email }]
        });

        if (existingUser) {
            return renderAuthPage(res, {
                activeTab: 'register',
                error: 'Ce nom utilisateur ou cet email existe déjà.',
                registerData: { username: username, email: email }
            });
        }

        var passwordHash = await bcrypt.hash(password, 10);
        await User.create({
            username: username,
            email: email,
            passwordHash: passwordHash
        });

        return renderAuthPage(res, {
            activeTab: 'login',
            success: 'Inscription réussie. Vous pouvez maintenant vous connecter.',
            loginData: { identifier: email }
        });
    } catch (err) {
        console.error(err);
        return renderAuthPage(res, {
            activeTab: 'register',
            error: 'Erreur serveur pendant l\'inscription.'
        });
    }
});

router.post('/login', async function(req, res) {
    try {
        if (!db.isDatabaseAvailable()) {
            return renderAuthPage(res, {
                activeTab: 'login',
                error: 'Connexion impossible: base de données indisponible.',
                loginData: { identifier: (req.body.identifier || '').trim() }
            });
        }

        var identifier = (req.body.identifier || '').trim();
        var password = req.body.password || '';

        if (!identifier || !password) {
            return renderAuthPage(res, {
                activeTab: 'login',
                error: 'Identifiant et mot de passe obligatoires.',
                loginData: { identifier: identifier }
            });
        }

        var search = identifier.includes('@')
            ? { email: identifier.toLowerCase() }
            : { username: identifier };
        var user = await User.findOne(search);

        if (!user) {
            return renderAuthPage(res, {
                activeTab: 'login',
                error: 'Compte introuvable.',
                loginData: { identifier: identifier }
            });
        }

        var isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return renderAuthPage(res, {
                activeTab: 'login',
                error: 'Mot de passe invalide.',
                loginData: { identifier: identifier }
            });
        }

        req.session.user = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            isAdmin: Boolean(user.isAdmin)
        };

        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return renderAuthPage(res, {
            activeTab: 'login',
            error: 'Erreur serveur pendant la connexion.'
        });
    }
});

router.get('/logout', function(req, res) {
    req.session.destroy(function() {
        res.redirect('/auth');
    });
});

module.exports = router;
