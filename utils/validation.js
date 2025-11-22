/**
 * Valida se um email é válido
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida dados de mídia
 * @param {object} mediaData 
 * @returns {object} { isValid: boolean, errors: array }
 */
const validateMedia = (mediaData) => {
    const errors = [];

    if (!mediaData.tipo) {
        errors.push('Tipo é obrigatório');
    }

    if (!mediaData.titulo || mediaData.titulo.trim() === '') {
        errors.push('Título é obrigatório');
    }

    if (!mediaData.data) {
        errors.push('Data é obrigatória');
    }

    if (mediaData.tipo === 'Audio' && !mediaData.adobe) {
        errors.push('Adobe é obrigatório para Audio');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    isValidEmail,
    validateMedia
};