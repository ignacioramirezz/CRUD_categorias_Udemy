const { Router } = require('express');
const { check } = require('express-validator');
const {validarJWT,validarCampos, esAdminRole} = require('../middlewares');
const { crearCategoria,
        devolverCategorias,
        obtenerCategoria,
        actualizarCategoria,
        borradoCategoria} = require('../controllers/categorias');
//con middlewares alcanza ua que en la carpeta raiz por el cual va entrar
const {existeCategoria} = require('../helpers/db-validators')
const router = Router();




//Se van a hacer aproximadamente entre 5 y 6 servicios 
// Obtener todas las categorias - publico
router.get('/',devolverCategorias);

// Obtener una categoria por id - publico 
//hacer el check('id').custom(existeCategoria) para crearlo en helpers 
//Chequea que sea un id de mongo
router.get('/:id',[
            check('id','No es un ID valido de mongo').isMongoId(),
            check('id').custom(existeCategoria),
            validarCampos
            ],obtenerCategoria);
// Crear categoria - privado - cualquier persona con un token valido
router.post('/',[
            validarJWT,
            check('nombre','El nombre es obligatorio').not().isEmpty(),
            validarCampos
            ],crearCategoria);

//Actualizar - privado - con cualquier token que sea valido
//que el put debe poner el nombre (verificar eso)
router.put('/:id',[
            validarJWT,
            check('nombre', 'El nombre es obligatorio ').not().isEmpty(),
            check('id').custom(existeCategoria),
            validarCampos
            ], actualizarCategoria);

//Borrar una categoria - Si es Admin
// que el id sea de mongo para poder hacer la validacion de forma correcta
router.delete('/:id',[
            validarJWT,
            esAdminRole,
            check('id').custom(existeCategoria),
            validarCampos
            ],borradoCategoria);

module.exports = router;