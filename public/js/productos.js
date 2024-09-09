window.addEventListener('load', async () => {
    //traemos el usuario y guardamos su id
    //obtengo el carrito con id usuario o lo creo
    //obtenemos los prodcutos disponibles

    const userResponse = await fetch('/api/usuarios/current');
    const usuarioJson = await userResponse.json();
    const usuario = usuarioJson.payload;
    const carrito = await fetch(`/api/carts/${usuario.id}`, {
        method: 'POST',
    });

    const cart = await carrito.json();
    const carritoId = cart.carrito['_id'];

    const response = await fetch('/api/products', {
        method: 'GET',
    });
    const productos = await response.json();
    productosAddcarrito(productos, carritoId, usuario['email'], usuario['rol']);
});

function mostrarContenidoPremium() {
    // Muestra el contenido premium
    document.getElementById('premium-content').style.display = 'block';
}
function productosAddcarrito(productos, carritoId, email, rol) {
    // Iteramos los productos y los mostramos en la vista, agregamos un botón a cada producto
    const container = document.getElementById('productos-container');

    productos.forEach((producto, index) => {
        const productoElem = document.createElement('div');
    
        const botonId = `miBoton-${index}`;
        const eliminarId = `eliminar-${index}`;
        productoElem.innerHTML = `
       <div class="producto-card">
                <div class="producto-header">
                    <h2 class="producto-title">${producto.title}</h2>
                   
                </div>
                <div class="producto-image-container">
                    <img src="${producto.thumbnail}" alt="${
            producto.title
        }" class="thumbnail-image"/>
                </div>
                <p class="producto-stock">(${producto.stock} disponibles)</p>
                <p class="producto-owner">Por ${producto.owner}</p>
                <p class="producto-price">$${producto.price}</p>
                <div class="button-container">
                    ${
                        producto.owner !== email
                            ? `<button id="${botonId}" type="button" class="add-to-cart-btn">Añadir al carrito</button>`
                            : ''
                    }
                    ${
                        producto.owner === email && rol === 'premium'
                            ? `<button id="${eliminarId}" type="button" class="eliminar-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 18L18 6M6 6l12 12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                              </button>`
                            : ''
                    }
                </div>
            </div>
        `;

        container.appendChild(productoElem);
        const mibotonId = document.getElementById(botonId);
        if (mibotonId) {
            // Creamos el evento para el botón "Añadir al carrito"
            const miBoton = document.getElementById(botonId);
            miBoton.addEventListener('click', async () => {
                try {
                    const response = await fetch(
                        `api/carts/${carritoId}/producto/${producto._id}`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ producto }),
                        }
                    );

                    if (response.status === 200) {
                        alert('Se agregó el producto al carrito');
                        location.reload();
                    } else {
                        alert('Error al agregar producto al carrito');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        }

        // Creamos el evento para el botón "Eliminar" si está presente

        const eliminarBtn = document.getElementById(eliminarId);
        if (eliminarBtn) {
            eliminarBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(
                        `/api/products/${producto._id}`,
                        {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    if (response.status === 200) {
                        alert('Se eliminó el producto correctamente');
                        location.reload();
                    } else {
                        alert('Error al eliminar el producto');
                    }
                } catch (error) {
                    console.error(
                        'Hubo un problema con la operación fetch:',
                        error.message
                    );
                }
            });
        }
    });
}
