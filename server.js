const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');

// Importar configurações - REMOVA a importação do connectDB se não existe
// const connectDB = require('./config/database'); // COMENTE OU REMOVA ESTA LINHA
const passport = require('./config/passport');

const app = express();

// ✅ CONEXÃO MONGODB CORRIGIDA (sem duplicação)
const connectDB = async () => {
    try {
        console.log('🔗 Conectando ao MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/projeto_medias', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
    } catch (error) {
        console.error('❌ Erro ao conectar com MongoDB:', error.message);
        console.log('🔄 Tentando reconectar em 5 segundos...');
        setTimeout(connectDB, 5000);
    }
};

// Conectar ao MongoDB
connectDB();

// ✅ CORS CORRIGIDO para produção
app.use(cors({
    origin: function (origin, callback) {
        // Aceita todos os origins em desenvolvimento, ou específicos em produção
        const allowedOrigins = [
            'https://projetomusica.onrender.com',
            'http://localhost:3000',
            'http://localhost:5000'
        ];
        
        // Em desenvolvimento, aceita qualquer origem
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // Em produção, verifica as origens permitidas
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session({
    secret: process.env.JWT_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // HTTPS em produção
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
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

// Rota para editar mídia
app.get('/medias/edit/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'media-edit.html'));
});

// ✅ Rotas de diagnóstico para produção
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({
        status: 'OK',
        environment: process.env.NODE_ENV || 'development',
        database: dbStatus,
        timestamp: new Date().toISOString(),
        port: process.env.PORT
    });
});

app.get('/api/debug', (req, res) => {
    res.json({
        server: 'running',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development',
        mongodb_uri: process.env.MONGODB_URI ? 'configured' : 'missing',
        node_version: process.version,
        platform: process.platform
    });
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Contact support'
    });
});

// Rota 404 para API
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Endpoint da API não encontrado' 
    });
});

// Rota 404 para páginas
app.use('*', (req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Página Não Encontrada - Sistema de Mídias</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    margin: 0; 
                    padding: 0; 
                    background: #f8f9fa; 
                    color: #2c3e50;
                }
                .navbar { 
                    background: #2c3e50; 
                    color: white; 
                    padding: 1rem 0; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .nav-container { 
                    max-width: 1200px; 
                    margin: 0 auto; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 0 1rem; 
                }
                .nav-logo { 
                    font-size: 1.5rem; 
                    font-weight: bold; 
                }
                .nav-links a { 
                    color: white; 
                    text-decoration: none; 
                    margin-left: 1.5rem; 
                }
                .main-content { 
                    padding: 2rem 1rem; 
                    min-height: 70vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .error-content { 
                    text-align: center; 
                    background: white; 
                    padding: 3rem; 
                    border-radius: 8px; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
                    max-width: 500px; 
                }
                .btn { 
                    display: inline-block; 
                    padding: 0.75rem 1.5rem; 
                    background: #3498db; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 0.5rem; 
                    transition: all 0.3s; 
                }
                .btn:hover { 
                    background: #2980b9; 
                    transform: translateY(-2px); 
                }
            </style>
        </head>
        <body>
            <nav class="navbar">
                <div class="nav-container">
                    <h1 class="nav-logo">🎬 Sistema de Mídias</h1>
                    <div class="nav-links">
                        <a href="/">Home</a>
                        <a href="/login">Login</a>
                    </div>
                </div>
            </nav>
            <main class="main-content">
                <div class="error-content">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
                    <h1 style="color: #e74c3c; margin-bottom: 1rem;">Página Não Encontrada</h1>
                    <p style="color: #7f8c8d; margin-bottom: 2rem; font-size: 1.1rem;">
                        A página que você está procurando não existe.
                    </p>
                    <div>
                        <a href="/" class="btn">🏠 Voltar para Home</a>
                        <a href="/medias" class="btn" style="background: #95a5a6;">📋 Ver Mídias</a>
                    </div>
                </div>
            </main>
        </body>
        </html>
    `);
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔧 Debug Info: http://localhost:${PORT}/api/debug`);
});