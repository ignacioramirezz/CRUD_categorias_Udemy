const { Router } = require('express');
const { check } = require('express-validator');
const {validarJWT,validarCampos, esAdminRole} = require('../middlewares');
const { crearProducto,
        devolverProductos,
        actualizarProducto,
        borradoProducto,
        obtenerProducto} = require('../controllers/productos');
const {existeProducto,existeCategoria} = require('../helpers/db-validators')
//con middlewares alcanza ua que en la carpeta raiz por el cual va entrar
const router = Router();


router.get('/',devolverProductos);


router.get('/:id',[
            check('id','No es un ID valido de mongo').isMongoId(),
            check('id').custom(existeProducto),
            validarCampos
            ],obtenerProducto);

router.post('/',[
            validarJWT,
            check('nombre','El nombre es obligatorio').not().isEmpty(),
            check('categoria','No es un una id de mongoDB'),
            check('categoria').custom(existeCategoria),
            validarCampos
            ],crearProducto);


router.put('/:id',[
            validarJWT,
            check('categoria','No es un id de mongo').isMongoId(),
            check('id').custom(existeProducto),
            validarCampos
            ], actualizarProducto);

            
router.delete('/:id',[
            validarJWT,
            esAdminRole,
            check('id','No es un id de mongo').isMongoId(),
            check('id').custom(existeProducto),
            validarCampos
            ],borradoProducto);

module.exports = router;