const express = require('express');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const router = express.Router();

// CADASTRAR NOVO USUÁRIO
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        
        // Validações
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios'
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Senha deve ter no mínimo 6 caracteres'
            });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Senhas não coincidem'
            });
        }
        
        // Verificar se usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Usuário já cadastrado com este email'
            });
        }
        
        // Criar usuário
        const user = await User.create({
            name,
            email,
            password,
            provider: 'local'
        });
        
        // Gerar token
        const token = generateToken(user._id);
        
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            message: 'Usuário cadastrado com sucesso!'
        });
        
    } catch (error) {
        console.error(' Erro no cadastro:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validações
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }
        
        // Buscar usuário
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        // Verificar senha
        const isPasswordCorrect = await user.matchPassword(password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Senha incorreta'
            });
        }
        
        // Verificar se usuário está ativo
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Usuário desativado'
            });
        }
       
        const token = generateToken(user._id);
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            message: 'Login realizado com sucesso!'
        });
        
    } catch (error) {
        console.error(' Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor'
        });
    }
});

router.post('/mock-login', async (req, res) => {
    try {
        const { email, name } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email é obrigatório'
            });
        }
        
        let user = await User.findOne({ email });
        
        if (!user) {
            user = await User.create({
                name: name || 'Usuário Demo',
                email: email,
                password: '123456', // Senha padrão
                provider: 'local'
            });
        }
        
        const token = generateToken(user._id);
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            message: 'Login demo realizado!'
        });
        
    } catch (error) {
        console.error('❌ Erro no login mock:', error);
        res.status(500).json({
            success: false,
            message: 'Erro no login demo'
        });
    }
});

router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                valid: false,
                message: 'Token não fornecido'
            });
        }
        

        res.json({
            valid: true,
            message: 'Token válido'
        });
        
    } catch (error) {
        res.status(401).json({
            valid: false,
            message: 'Token inválido'
        });
    }
});

router.post('/logout', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Logout realizado com sucesso' 
    });
});

module.exports = router;