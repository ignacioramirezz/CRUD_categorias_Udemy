const { validationResult } = require('express-validator');


const validarCampos = ( req, res, next ) => {
    //lo que hace esto poder chequear todos los errores que puede haber
    //en cuanto los chequeos para poder ver 
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }
    next();
}

module.exports = {
    validarCampos
}
