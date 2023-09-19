//servicios de CRUD con la creacion de productos
const {response,request} =require('express')
const Producto = require('../models/producto')


//Creacion de una categoria
const crearProducto = async(req,res=response) => {

    const {estado,usuario,...body} = req.body;
    /**
     * La expresión const {estado,usuario} = req.body; asigna los valores de las propiedades estado y 
     * usuario del objeto req.body a las variables estado y usuario. Mientras que el resto de las 
     * variables que viene en el request van a ir a la variable llamada "body"
     */
    const existe = await Producto.findOne({nombre:body.nombre})
    //lo que tiene findOne es que devuelve el primer objeto que coincide
    //con el criterio de busqueda requerido
    if(existe){
        return res.status(400).json({
            msg: `El producto cuyo nombre es ${existe.nombre} ya existe en la base de datos`
        });
    }
    //Generar la informacion para se almacene en la base de datos
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    };

    const producto = new Producto(data);
    //Realiza el almacenamiento en la base de datos
    await producto.save();

    res.status(201).json({
        producto
    })
}

//obtener los productos de forma paginada
const devolverProductos = async(req,res=response) => {
    const [total,productos] = Promise.all([
        Producto.countDocuments(),
        Producto.find().populate('usuario','nombre').populate('categoria','nombre')
        //El segundo campo
        /**
         * , se filtra la información del documento de usuario a solo su nombre.
         */
        /**
         * Esta operación busca todos los documentos en la colección de productos y 
         * realiza una operación de "populación" para obtener información adicional de 
         * las referencias a las colecciones de usuarios y categorías
         */
        //los resultados se van almacenar en el array llamado  productos
    ])
    res.json({
        total,
        productos
    })
}


//Obtener un producto con la forma de mandando un id para asi mostrar la informacion
const obtenerProducto = async(req,res=response) => {
    //para hacer esta operacion debo obtener la respuesta de que si la operacion
    const id = req.params.id;
    const ProductoEncontrado = await Producto.findById(id).populate('usuario','nombre')
                                                            .populate('categoria','nombre');
    res.json(ProductoEncontrado);
};

//Actualizar un producto haciendo la validacion necesaria
const actualizarProducto = async(req,res=response) => {
    const {id} = req.params;
    const {estado,usuario, ...data} = req.body;
    if (data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    //tengo que grabarme el nombre de la categoria dada
    //debo establece el usuario que hizo la modificacion
    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id,data,{new:true});
    //lo que se hace es la busqueda por id y se hace la modificacion de informacion
    /**
     *  Esto es una opción que le dice a Mongoose que devuelva 
     *  el documento actualizado después de la operación de actualización
     */
    res.json(producto)
}


//Borrar un producto con un id pasandolo como parametro
const borradoProducto = async(req,res=response ) => {
    const {id} = req.params;
    const productoborrado = await Producto.findByIdAndUpdate(id,{estado:false});
    res.json(productoborrado)
}

module.exports = {
    crearProducto,
    devolverProductos,
    obtenerProducto,
    actualizarProducto,
    borradoProducto
}