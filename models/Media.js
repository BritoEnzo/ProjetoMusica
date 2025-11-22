const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['Lucas', 'DVD', 'CD4', 'Audio'],
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    adobe: {
        type: String,
        required: function() {
            return this.tipo === 'Audio'; // Só é obrigatório para Audio
        }
    },
    descricao: String,
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Media', MediaSchema);