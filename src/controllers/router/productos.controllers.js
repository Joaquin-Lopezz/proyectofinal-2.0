export function vistaProducto (req, res)  {
    res.render('productos.handlebars', {
        pageTitle: 'Productos',
    });
}