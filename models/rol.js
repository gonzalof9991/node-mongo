const { Schema, model} = require('mongoose');

const RolSchema = Schema({
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    status: {
        type: Boolean,
        default: true,
    }
});

module.exports = model('Rol', RolSchema);