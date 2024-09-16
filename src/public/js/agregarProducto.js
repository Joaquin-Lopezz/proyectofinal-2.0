document.addEventListener('DOMContentLoaded', async () => {
    const formProducto = document.querySelector('form');

    const productos = await fetchData();
    mostrarProductos(productos);

    document.getElementById('logout').addEventListener('click', logout);
    document.getElementById('usuarios').addEventListener('click', usuarios);

    document
        .getElementById('agregar-producto')
        .addEventListener('click', async (event) => {
            event.preventDefault();
            const formData = new FormData(formProducto);

            const response = await fetch('/api/products/', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 200) {
                alert('Producto agregado a la base de datos');
                location.reload();
            }
            if (response.status === 500) {
                alert('Complete todos los datos');
            }
        });
});

const fetchData = async () => {
    try {
        const response = await fetch('/api/products', {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Error al obtener los datos:', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
};

function mostrarProductos(productos) {
    const container = document.getElementById('productos-container');
    container.innerHTML = ''; // Clear existing content

    productos.forEach((producto, index) => {
        const productoElem = document.createElement('div');
        productoElem.className = 'producto-container';

        const detailsElem = document.createElement('div');
        detailsElem.className = 'producto-details';

        const formContainer = document.createElement('div');
        formContainer.className = 'form-container';

        detailsElem.innerHTML = `
         <div class="product-card">
    <h2 class="product-title">${producto.title}</h2>
    <div class="product-image-container">
        <img src="${
            producto.thumbnail
        }" alt="Thumbnail del producto" class="product-thumbnail">
    </div>
    <div class="product-details">
        <p><strong>ID:</strong> ${producto._id}</p>
        <p><strong>Descripción:</strong> ${producto.description}</p>
        <p><strong>Precio:</strong> $${producto.price}</p>
        <p><strong>Código:</strong> ${producto.code}</p>
        <p><strong>Stock:</strong> ${producto.stock}</p>
        <p><strong>Categoría:</strong> ${producto.category}</p>
        <p><strong>Propietario:</strong> ${producto.owner}</p>
        <p><strong>Estado:</strong> ${
            producto.status ? 'Activo' : 'Inactivo'
        }</p>
    </div>
    <div class="product-actions">
        <button data-id="${
            producto._id
        }" class="btn btn-eliminar">Eliminar</button>
        <button data-id="${producto._id}" class="btn btn-editar">Editar</button>
    </div>
</div>
        `;

        productoElem.appendChild(detailsElem);
        productoElem.appendChild(formContainer);
        container.appendChild(productoElem);

        const btnEliminar = productoElem.querySelector('.btn-eliminar');
        const btnEditar = productoElem.querySelector('.btn-editar');

        btnEliminar.addEventListener('click', async () => {
            try {
                const admin = 'admin';
                const response = await fetch(`/api/products/${producto._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ admin }),
                });

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

        btnEditar.addEventListener('click', () => {
            mostrarFormularioEdicion(producto, formContainer);
        });
    });
}

function mostrarFormularioEdicion(producto, formContainer) {
    const formEdicionExistente = formContainer.querySelector('.form-edicion');
    if (formEdicionExistente) {
        formEdicionExistente.remove();
    }

    const formEdicion = document.createElement('form');
    formEdicion.className = 'form-edicion';
    formEdicion.setAttribute('data-product-id', producto._id);
    formEdicion.innerHTML = `
        <h3>Editar Producto</h3>
        <div class="form-group">
            <label>Title:</label>
            <input type="text" class="edit-title" value="${
                producto.title
            }" required>
        </div>
        <div class="form-group">
            <label>Description:</label>
            <input type="text" class="edit-description" value="${
                producto.description
            }" required>
        </div>
        <div class="form-group">
            <label>Price:</label>
            <input type="number" class="edit-price" value="${
                producto.price
            }" required>
        </div>
        <div class="form-group">
            <label>Thumbnail:</label>
            <input type="text" class="edit-thumbnail" value="${
                producto.thumbnail
            }" required>
        </div>
        <div class="form-group">
            <label>Stock:</label>
            <input type="number" class="edit-stock" value="${
                producto.stock
            }" required>
        </div>
        <div class="form-group">
            <label>Category:</label>
            <input type="text" class="edit-category" value="${
                producto.category
            }" required>
        </div>
        <div class="form-group">
            <label>Status:</label>
            <input type="checkbox" class="edit-status" ${
                producto.status ? 'checked' : ''
            }>
        </div>
        <button type="submit">Guardar Cambios</button>
        <button type="button" class="cancelar-edicion">Cancelar</button>
    `;

    formContainer.appendChild(formEdicion);

    formEdicion.addEventListener('submit', async (event) => {
        event.preventDefault();
        await enviarFormularioEdicion(producto._id, formEdicion);
    });

    formEdicion
        .querySelector('.cancelar-edicion')
        .addEventListener('click', () => {
            formEdicion.remove();
        });
}

async function enviarFormularioEdicion(productId, formEdicion) {
    const title = formEdicion.querySelector('.edit-title').value;
    const description = formEdicion.querySelector('.edit-description').value;
    const price = parseInt(formEdicion.querySelector('.edit-price').value);
    const thumbnail = formEdicion.querySelector('.edit-thumbnail').value;
    const stock = parseInt(formEdicion.querySelector('.edit-stock').value);
    const category = formEdicion.querySelector('.edit-category').value;
    const status = formEdicion.querySelector('.edit-status').checked;

    const queryString = new URLSearchParams({
        title,
        description,
        price,
        thumbnail,
        stock,
        category,
        status,
    });

    const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: queryString,
    });

    if (response.status === 200) {
        alert('Producto actualizado correctamente');
        location.reload();
    } else {
        alert('Error al actualizar el producto');
    }
}
async function usuarios() {
    window.location.href = '/users';
}
async function logout(event) {
    const response = await fetch('/api/sessions/current', {
        method: 'DELETE',
    });

    if (response.status === 200) {
        window.location.href = '/login';
    } else {
        const error = await response.json();
        alert(error.message);
    }
}
