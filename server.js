const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');

// Importar configurações
const connectDB = require('./config/database');
const passport = require('./config/passport');

const app = express();

// Conectar ao MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session({
    secret: process.env.JWT_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Use true se tiver HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/medias', mediaRoutes);

// Rotas para páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/medias', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'media-list.html'));
});

app.get('/medias/new', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'media-form.html'));
});

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({ 
        message: 'Algo deu errado!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Rota 404 para API
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'Endpoint da API não encontrado' });
});

// Rota 404 para páginas
app.use('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Acesse: http://localhost:${PORT}`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
});