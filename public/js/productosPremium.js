window.addEventListener('load', async () => {
    const userResponse = await fetch('/api/usuarios/current');
    const usuarioJson = await userResponse.json();
    const usuario = usuarioJson.payload;
    if (usuario['rol'] === 'premium') {
        document.getElementById('form-container').style.display = 'block';
    }
    usuario['email'];
    const formProducto = document.getElementById('product-form');

    document
        .getElementById('agregar-producto')
        .addEventListener('click', async (event) => {
            event.preventDefault();

            const formData = new FormData(formProducto);

            formData.append('owner', usuario['email']);

            try {
                const response = await fetch('/api/products/', {
                    method: 'POST',
                    body: formData,
                });

                if (response.status === 200) {
                    alert('Producto agregado a la base de datos');
                    location.reload();
                } else {
                    const errorData = await response.json();
                    alert(errorData.error);
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                alert('Ocurrió un error inesperado al agregar el producto.');
            }
        });
});
