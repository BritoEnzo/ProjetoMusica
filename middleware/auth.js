const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Pegar token do header
            token = req.headers.authorization.split(' ')[1];

            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Pegar usuário do token
            req.user = await User.findById(decoded.id).select('-password');
            
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Não autorizado, token falhou' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Não autorizado, sem token' });
    }
};

// Middleware para verificar se é GET (público) ou outras methods (protegidas)
const optionalAuth = async (req, res, next) => {
    if (req.method === 'GET') {
        return next(); // GET é público
    }
    
    // Para POST, PUT, DELETE, verifica autenticação
    return protect(req, res, next);
};

module.exports = { protect, optionalAuth };