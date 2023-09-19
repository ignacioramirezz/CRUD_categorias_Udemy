const categoria = require('../models/categoria');
const producto = require('../models/producto');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


//En esta caso voy a hacer la verficacion de que la categoria que esta busqueda
//existe realmente en la base de datos
const existeCategoria = async( id ) => {
    //verifica el id de la categoria que da
    const existeCategoriaID = await categoria.findById(id);
    if (!existeCategoriaID) {
        throw new Error(`El id de la categoria no existe ${id}`);
    }
}


const existeProducto = async(id) => {
        const existeProductoID = await producto.findById(id);
        if (!existeProductoID) {
            throw new Error(`El id del producto no existe ${id}`)
        }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
}

