const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
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
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: false
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    }
});

ProductoSchema.methods.toJSON = function() {
    const {_v,estado, ...data} = this.toObject();
    return data;
}


module.exports = model( 'Producto', ProductoSchema );

