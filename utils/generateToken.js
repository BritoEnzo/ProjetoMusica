const jwt = require('jsonwebtoken');

/**
 * Gera um token JWT para o usuário
 * @param {string} id - ID do usuário
 * @returns {string} Token JWT
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expira em 30 dias
    });
};

module.exports = generateToken;