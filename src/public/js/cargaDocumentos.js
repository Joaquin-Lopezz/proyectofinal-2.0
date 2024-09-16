document
    .getElementById('documentUploadForm')
    .addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita la recarga de la página

        const formData = new FormData();

        // Agrega los archivos al FormData
        formData.append(
            'identificacion',
            document.getElementById('identificacion').files[0]
        );
        formData.append(
            'comprobanteDomicilio',
            document.getElementById('comprobanteDomicilio').files[0]
        );
        formData.append(
            'comprobanteCuenta',
            document.getElementById('comprobanteCuenta').files[0]
        );
        const emailUsuario = localStorage.getItem('emailUsuario');

        try {
            const response = await fetch(
                `/api/users/documents`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            if (response.ok) {
                const result = await response.json();
                alert('Documentos subidos exitosamente');
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
