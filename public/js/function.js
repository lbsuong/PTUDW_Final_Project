const bcrypt = require('bcryptjs');

function hash(pass_str) {
    return bcrypt.hashSync(pass_str, 10);
}