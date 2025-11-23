const express = require('express');
const router = express.Router();

// Array temporário para teste (substituirá pelo MongoDB)
let medias = [];

// GET /api/medias - Público
router.get('/', (req, res) => {
    res.json(medias);
});

// POST /api/medias - Protegido (simplificado)
router.post('/', (req, res) => {
    const media = {
        _id: Date.now().toString(),
        ...req.body,
        createdAt: new Date()
    };
    medias.push(media);
    res.status(201).json(media);
});

router.delete('/:id', (req, res) => {
    const index = medias.findIndex(m => m._id === req.params.id);
    if (index !== -1) {
        medias.splice(index, 1);
        res.json({ message: 'Mídia excluída' });
    } else {
        res.status(404).json({ message: 'Mídia não encontrada' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const media = await Media.findById(req.params.id)
            .populate('usuario', 'name email');
        
        if (!media) {
            return res.status(404).json({
                success: false,
                message: 'Mídia não encontrada'
            });
        }
        
        res.json({
            success: true,
            data: media
        });
        
    } catch (error) {
        console.error(' Erro ao buscar mídia:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao carregar mídia'
        });
    }
});

module.exports = router;