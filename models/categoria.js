const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true,
        required: true,
    },
    usuario: {
        //necesita saber que usuario creo la categoria
        type: Schema.Types.ObjectId, // Es otro objeto de mongo
        ref: 'Usuario', // Apunta a la coleccion Usuario model('Usuario',UsuarioSchema)
        required: true
    }
});


module.exports = model( 'Categoria', CategoriaSchema );
