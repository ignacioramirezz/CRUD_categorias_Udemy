//Esto nos va ayudar a centralizar todos modelos en un index

const Categoria = require('./categoria');
const Role = require('./role');
const  Server = require('./server');
const Usuario = require('./usuario');
const Producto = require('./producto');

module.exports = {
    Categoria,
    Role,
    Server,
    Usuario,
    Producto
}