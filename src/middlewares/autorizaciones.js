
export function soloLogueadosApi(req, res, next) {
    if (!req.isAuthenticated()) {
        return res
            .status(403)
            .json({ status: 'error', message: 'necesita iniciar sesion' });
    }
    next();
}

export function autorizacionUsuario(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }

    if (req.user.rol !== 'admin') {
        next();
    } else {
        res.redirect('/admin');
    }
}

export function autorizacionProductos(req, res, next) {
    if (req.user.rol !== 'premium') {
        return res.redirect('/profile');
    }
    if (!req.user) {
        return res.redirect('/login');
    }

    if (req.user.rol !== 'admin') {
        next();
    } else {
        res.redirect('/admin');
    }
}
export function statusDocumentacion(req,res,next){

    if(req.user.status_document == null){
        next()
    }else{
        return res.redirect('/profile')
    }
    
    
}
export function autorizacionAdmin(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }
    if (req.user.rol == 'admin') {
        next();
    } else {
        res.send('acceso denegado');
    }
}

