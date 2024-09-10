document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleProfile');
    const cartButton = document.getElementById('toggleCarts');
    const profileInfo = document.getElementById('profileInfo');
    const cartInfo = document.getElementById('cartInfo');
    const overlay = document.getElementById('overlay');
    const spans = document.querySelectorAll('span');

    // Inicialmente oculta la sección de perfil y el overlay
    profileInfo.style.display = 'none';
    overlay.style.display = 'none';

    // Maneja el clic en el ícono para mostrar u ocultar la información del perfil
    toggleButton.addEventListener('click', () => {
        if (profileInfo.classList.contains('open')) {
            profileInfo.classList.remove('open');
            overlay.style.display = 'none'; // Oculta el overlay
            setTimeout(() => {
                profileInfo.style.display = 'none';
            }, 500); // Coincide con la duración de la transición CSS
            toggleButton.setAttribute('aria-expanded', 'false');
        } else {
            profileInfo.style.display = 'block';
            overlay.style.display = 'block'; // Muestra el overlay
            setTimeout(() => {
                profileInfo.classList.add('open');
            }, 0); // Sin retardo, asegura que display: block se aplique antes de la animación
            toggleButton.setAttribute('aria-expanded', 'true');
        }
        toggleButton.textContent = profileInfo.classList.contains('open')
            ? '❌'
            : '👤'; // Cambia el ícono
    });

    cartButton.addEventListener('click', () => {
        if (cartInfo.classList.contains('open')) {
            cartInfo.classList.remove('open');
            overlay.style.display = 'none'; // Oculta el overlay
            setTimeout(() => {
                cartInfo.style.display = 'none';
            }, 500); // Coincide con la duración de la transición CSS
            cartButton.setAttribute('aria-expanded', 'false');
        } else {
            cartInfo.style.display = 'block';
            overlay.style.display = 'block'; // Muestra el overlay
            setTimeout(() => {
                cartInfo.classList.add('open');
            }, 0); // Sin retardo, asegura que display: block se aplique antes de la animación
            cartButton.setAttribute('aria-expanded', 'true');
        }
        cartButton.textContent = cartInfo.classList.contains('open')
            ? '❌'
            : '🛒'; // Cambia el ícono
    });

    async function loadProfile() {
        try {
            const response = await fetch('/api/usuarios/current');
            if (response.status === 403) {
                alert('Necesitas loguearte para ver esta info!');
                window.location.href = '/login';
                return;
            }

            const result = await response.json();
            const usuario = result.payload;

            const profileImage = document.getElementById('profilePicture');
            if (usuario.profileImage) {
                profileImage.src = usuario.profileImage;
            }
            spans[0].textContent = usuario.nombre;
            spans[1].textContent = usuario.apellido;
            spans[2].textContent = usuario.email;
            spans[3].textContent = usuario.rol;
            usuario.profileImage;
            localStorage.setItem('nombreUsuario', usuario.nombre);
            localStorage.setItem('emailUsuario', usuario.email);

            const profileHeading = profileInfo.querySelector('h1');

            if (profileHeading) {
                const verificationIcon = document.createElement('span');
                verificationIcon.textContent = '✔️';
                verificationIcon.style.color = usuario.status;
                ('green');
                verificationIcon.style.opacity = usuario.status
                    ? '1'
                    : '0.2    ';
                profileHeading.appendChild(verificationIcon);
            }

            if (usuario.rol === 'premium') {
                var btnProductos = document.createElement('button');
                btnProductos.id = 'btnProductos';
                btnProductos.textContent = 'nuevo producto';
                btnProductos.onclick = function () {
                    window.location.href = '/productos';
                };
                var profileActions =
                    document.getElementById('buttonNewProducto');
                if (profileActions) {
                    profileActions.appendChild(btnProductos);
                }
            }

            updatePremiumButton(usuario.rol, usuario.email, usuario.status);

            if (usuario.status !== 'true') {
                cargarDocumentos(usuario.status);
            } else {
                var documentosButton = document.getElementById('documentos');
                documentosButton.style.display = 'none';
            }
            await loadCart(usuario.cart);

            document.getElementById('logout').addEventListener('click', logout);
            document
                .getElementById('btnProductos')
                .addEventListener(
                    'click',
                    () => (window.location.href = '/productos')
                );
        } catch (error) {
            console.error('Error cargando el perfil:', error);
        }
    }

    async function cargarDocumentos() {
        const documentosButton = document.getElementById('documentos');
        documentosButton.addEventListener('click', () => {
            window.location.href = `/documentacion`;
        });
    }

    async function updatePremiumButton(rol, email, status) {
        const premiumButton = document.getElementById('btnPremium');

        if (status === null) {
            premiumButton.style.opacity = '0.3';
            premiumButton.style.backgroundColor = '#808080';
            premiumButton.addEventListener('click', () => {
                alert('Primero tienes que cargar las credenciales');
            });
            return;
        }
        premiumButton.textContent =
            rol === 'premium' ? 'Quitar Premium' : 'Hacerme Premium';
        premiumButton.addEventListener('click', () =>
            togglePremium(email, rol)
        );
    }

    async function togglePremium(email, rol) {
        try {
            const response = await fetch('/api/usuarios/premium', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, rol }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(`tu rol cambio a: ${data.message}`);
                location.reload();
            } else {
                alert('Error al cambiar el estado Premium.');
            }
        } catch (error) {
            console.error('Error al actualizar Premium:', error);
        }
    }

    async function logout() {
        try {
            const response = await fetch('/api/sessions/current', {
                method: 'DELETE',
            });

            if (response.ok) {
                localStorage.removeItem('emailUsuario');
                localStorage.removeItem('nombreUsuario');
                window.location.href = '/login';
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    async function loadCart(cartId) {
        try {
        
            const carritoResponse = await fetch(`/api/carts/${cartId}`, {
                method: 'GET',
            });
            const carrito = await carritoResponse.json();
          
            renderCartProducts(carrito.cart,carrito.cart.email);
        } catch (error) {
            console.error('Error cargando el carrito:', error);
        }
    }

    function renderCartProducts(productos, mail) {
        const container = document.getElementById('productos-carrito');
        let amount = 0;

        productos.products.forEach((producto) => {
            const totalProducto = producto.price * producto.quantity;
            amount += totalProducto;

            const productoElem = document.createElement('div');
            const botonIdDelete = `delete-${producto.idProduct}`;
            productoElem.innerHTML = `
             <div style="border: 1px solid #e0e0e0; padding: 12px; margin-bottom: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); background-color: #f9f9f9; display: flex; align-items: center;">
    <div style="flex-shrink: 0; margin-right: 12px;">
        <img src="${producto.thumbnail}" alt="Thumbnail del producto" style="width: 120px; height: 90px; border-radius: 6px;">
    </div>
    <div>
        <h2 style="font-size: 18px; margin-bottom: 8px; color: #333; text-transform: capitalize;">${producto.title}</h2>
        <p style="font-size: 16px; font-weight: bold; color: #007bff; margin-bottom: 4px;">(Cantidad: ${producto.quantity})</p>
        <p style="font-size: 14px; color: #333; font-weight: bold; margin-bottom: 0;">Total: $${totalProducto}
            <button id="${botonIdDelete}" style="border: none; padding: 6px 12px; border-radius: 6px; background-color: #dc3545; color: #fff; font-size: 14px; font-weight: bold; cursor: pointer; margin-left: 10px;">Eliminar</button>
        </p>
    </div>
</div>`;
            container.appendChild(productoElem);

            document
                .getElementById(botonIdDelete)
                .addEventListener('click', async () => {
                    try {
                        console.log(productos)
                        const response = await fetch(
                            `/api/carts/${productos._id}/${producto.idProduct}`,
                            { method: 'DELETE' }
                        );
                        if (response.ok) {
                            location.reload();
                        } else {
                            alert('Error al eliminar el producto.');
                        }
                    } catch (error) {
                        console.error(
                            'Error al eliminar producto del carrito:',
                            error
                        );
                    }
                });
        });

        const precioFinalElem = document.createElement('div');
        precioFinalElem.innerHTML = `
            <div style="display: inline-block; border: 2px solid #007bff; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <h1 style="font-size: 25px; font-weight: bold; color: #333; margin: 0;">TOTAL = $${amount}</h1>
                <button id="buyButton" style="display: inline-block; border: 2px solid #007bff; padding: 8px 16px; border-radius: 8px; background-color: #007bff; color: #fff; font-size: 16px; font-weight: bold; cursor: pointer;">Comprar</button>
            </div>`;
        container.appendChild(precioFinalElem);
     
        console.log(productos._id)
        document    
            .getElementById('buyButton')
            .addEventListener('click', async () => {
                try {
                    const response = await fetch(
                        `/api/carts/${productos._id}/purchase`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                products: productos.products,
                            }),
                        }
                    );

                    if (response.ok) {
                        const responseData = await response.json();
                        if(responseData.status == 'success'){
                            alert('compra realizada')
                            location.reload()
                        }
                        if (responseData.status == 'error') {
                            alert(responseData.payload.mensaje);
                        } 
                    } else {
                        alert('Error al realizar la compra.');
                    }
                } catch (error) {
                    console.error('Error al procesar la compra:', error);
                }
            });
    }

    // Carga inicial del perfil
    loadProfile();
});
