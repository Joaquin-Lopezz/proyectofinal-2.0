window.addEventListener('load', async () => {
    try {
        const response = await fetch('/api/usuarios/allUsers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        if (response.ok) {
            const usuarios = await response.json();
            const usuariosContainer =
                document.getElementById('usuarios-container');
            usuarios.forEach((usuario) => {
                const userDiv = document.createElement('div');

                const lastConnectionDate = new Date(usuario.last_connection);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - lastConnectionDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const statusClass = diffDays > 2 ? 'inactive' : 'active';

                userDiv.classList.add(statusClass);

                userDiv.innerHTML = `
                    <p>Nombre: ${usuario.nombre}</p>
                    <p>Email: ${usuario.email}</p>
                    <p>Rol: ${usuario.rol}</p>
                    <p>Última conexión: ${usuario.last_connection}</p>   
                `;
                usuariosContainer.appendChild(userDiv);
            });
        } else {
            alert('error en la carga de usuarios');
        }

        const buttonUser = document.getElementById('usuariosInactivos');
        buttonUser.addEventListener('click', eliminarUsuarios);
        const buttonAdmin = document.getElementById('admin');
        buttonAdmin.addEventListener('click', adminHome);
    } catch (error) {
        console.error('Error en la petición:', error);
        alert('Error en la petición de usuarios');
    }
});
async function adminHome() {
    window.location.href = '/admin';
}
async function eliminarUsuarios() {
    const response = await fetch('/api/usuarios/delete', {
        method: 'DELETE',
    });
    const usuario = await response.json();
    if (usuario.message) {
        alert(usuario.message);
        location.reload();
    } else {
        alert('se ha generado un error eliminando usuarios ');
    }
}
