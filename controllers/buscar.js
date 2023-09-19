const {response} = require('express')
const {ObjectId} = require('mongoose').Types;
const {Usuario,Categoria,Producto} = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
];

//uso colecciones permitidas para poder chequear que la coleccion que me mandaron
//esta en el arreglo de coleccionespermitidas

const buscarUsuarios = async(termino = '',res=response) => {
//la idea es poder realizar la busqueda por nombre del estudiante 
// y que no sea por id del usuario
    const esMongoID= ObjectId.isValid(termino); // si es un id de mongo devuelve TRUE sino FALSE
    if (esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }
    //expresion regular que va evitar la busqueda es sencible a las mayusculas
    const regex = new RegExp(termino,'i');

    //aca arranco con la asignacion de los atributos para poder comenzar la busqueda
    //segun ciertos parametros de busqueda
    const usuarios = await Usuario.find({
        $or: [{nombre:regex},{correo:regex}],
        //y si ademas quiero que el usuario se encuentre activo 
        $and: [{estado:true}]
    });
    res.json({
        results: usuarios
    })
}


const buscarCateorias = async(termino = '',res=response) => {
    const esMongoID= ObjectId.isValid(termino);
    if (esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }
    const regex = new RegExp(termino,'i');
    const categorias = await Categoria.find({nombre:regex,estado:true});
    res.json({
        results: categorias
    })
}


const buscarProducto = async(termino = '',res=response) => {
    const esMongoID= ObjectId.isValid(termino);
    if (esMongoID){
        const producto = await Producto.findById(termino)
                .populate('categoria','nombre')
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    const regex = new RegExp(termino,'i');
    const productos = await Producto.find({nombre:regex,estado:true})
                .populate('categoria','nombre')
    res.json({
        results: productos
    })
}


const buscar = (req,res=response) => {

    const {coleccion,termino} = req.params

    if (!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }
    switch (coleccion){
        case 'usuarios':
            buscarUsuarios(termino,res);
        break;
        case 'categoria':
            buscarCateorias(termino,res)
        break;
        case 'productos':
            buscarProducto(termino,res)
        break;
        case 'roles':

        break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            })
    }
}

module.exports = {
    buscar
}