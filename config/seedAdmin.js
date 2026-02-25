var bcrypt = require('bcryptjs');
var User = require('../models/User');

async function ensureAdminUser() {
    var username = 'admin';
    var email = 'admin@admin.fr';
    var password = 'admin';

    var adminUser = await User.findOne({
        $or: [{ username: username }, { email: email }]
    });

    if (adminUser) {
        if (!adminUser.isAdmin) {
            adminUser.isAdmin = true;
            await adminUser.save();
        }
        return;
    }

    var passwordHash = await bcrypt.hash(password, 10);
    await User.create({
        username: username,
        email: email,
        passwordHash: passwordHash,
        isAdmin: true
    });

    console.log('Utilisateur admin créé: admin@admin.fr');
}

module.exports = ensureAdminUser;
