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

// ✅ Rota para editar mídia (ADICIONE ESTA)
app.get('/medias/edit/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'media-edit.html'));
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
    res.status(404).json({ 
        success: false,
        message: 'Endpoint da API não encontrado' 
    });
});

// ✅ Rota 404 CORRIGIDA para páginas
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

// Rota para ir para a pagina de edição das coisas
app.get('/medias/edit/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'media-edit.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Acesse: http://localhost:${PORT}`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
});