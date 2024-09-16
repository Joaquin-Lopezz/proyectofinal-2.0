document
    .getElementById('documentUploadForm')
    .addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData();

        formData.append(
            'profile-image',
            document.getElementById('profile-image').files[0]
        );

        const emailUsuario = localStorage.getItem('emailUsuario');
        const nombre = document.getElementById('inputNombre').value;
        const apellido = document.getElementById('inputApellido').value;

        formData.append('nombre', nombre);
        formData.append('apellido', apellido);
        try {
            const response = await fetch(
                `/api/users/${emailUsuario}/documents`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            if (response.ok) {
                const result = await response.json();
                alert('perfil actualizado');
                window.location.href = '/profile';
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error al subir los documentos:', error);
            alert('Hubo un error al subir los documentos. Intenta nuevamente.');
        }
    });
