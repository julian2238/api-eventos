const validarJWT = async(req, res, next) => {
    const authHeader = req.headers['Authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).send({
            status: false,
            message: 'No se ha proporcionado un token de autenticación'
        });
    }

    try {

        //Validar token firebase
        
    } catch (error) {
        return res.status(401).send({
            status: false,
            message: 'Token de autenticación inválido'
        });
    }
    
}