const express = require('express');
const router = express.Router();

// Rota de login mock para teste
router.get('/google', (req, res) => {
    // Simula login com Google
    res.redirect('/dashboard?token=mock-token-123');
});

router.get('/facebook', (req, res) => {
    // Simula login com Facebook  
    res.redirect('/dashboard?token=mock-token-123');
});

router.post('/logout', (req, res) => {
    res.json({ message: 'Logout realizado' });
});

module.exports = router;