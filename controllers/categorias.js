const {response,request} = require('express')
const Categoria = require('../models/categoria')


//Obtener categorias - paginado - total - populate (investigar)
// popoulate el objetivo es que aparezca el usuario y toda la infrmacion del usuario para indicar quien fue que lo grabo

const devolverCategorias = async(req,res=response) => {
    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(),
        Categoria.find().populate('usuario')
    ])
    res.json({
        total,
        categorias
    })
}

//Obtener categoria - populate () 
const obtenerCategoria = async(req,res=response) => {
    //para hacer esta operacion debo obtener la respuesta de que si la operacion
    try {
        const id = req.params.id;
        const categoriaEncontrada = await Categoria.findById(id).populate('usuario');
        if (!categoriaEncontrada) {
            return res.status(404).json({
            msg: 'La categoría no existe'
        });
        } 
        res.json({
            msg: 'El GET funcionó de forma correcta',
            categoria: categoriaEncontrada
        });
        } catch (error) {
          // Manejar errores de manera apropiada, por ejemplo, enviando una respuesta de error al cliente
            res.status(500).json({
            msg: 'Ha ocurrido un error al obtener la categoría.'
        });
        }
};

//Actualizar la categoria haciendo las validaciones
// fijarme que no debe hicistir ese nombre al cual elegi para suplantar 
const actualizarCategoria = async(req,res=response) => {
    const {id} = req.params;
    const {estado,usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    //tengo que grabarme el nombre de la categoria dada
    //debo establece el usuario que hizo la modificacion
    data.usuario = req.usuario._id;
    const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true});
    //lo que se hace es la busqueda por id y se hace la modificacion de informacion
    /**
     *  Esto es una opción que le dice a Mongoose que devuelva 
     *  el documento actualizado después de la operación de actualización
     */
    res.json(categoria)
}

//Borrar categoria (recordar estado:false)
const borradoCategoria = async(req,res=response) => {
    const {id} = req.params;
    const usuario = await Categoria.findByIdAndUpdate(id,{estado:false});
    res.json(usuario)
}


//Creacion de una categoria 
const crearCategoria= async(req,res=response) => {
    const nombre = req.body.nombre.toUpperCase(); // agarra al nombre del cuerpo 
    // y lo pasa a mayuscula
    const categoriaDB = await Categoria.findOne({nombre});
    if (categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })  
    }

    // Generar la data a guardar
    const data = {
        nombre,
        //se guarda el id del usuario que realizo el almacenado de la categoria 
        usuario: req.usuario._id,
    }

    const categoria = new Categoria(data);
    //Guardar en la BD
    await categoria.save();

    res.status(201).json({
        categoria
    })
}

module.exports = {
    crearCategoria,
    devolverCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borradoCategoria
}