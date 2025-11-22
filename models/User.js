const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false // Para login social pode ser opcional
    },
    provider: {
        type: String,
        enum: ['google', 'facebook', 'local'],
        default: 'local'
    },
    googleId: String,
    facebookId: String,
    avatar: String
}, {
    timestamps: true // Cria createdAt e updatedAt automaticamente
});

// Método para comparar senha
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware para criptografar senha antes de salvar
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);