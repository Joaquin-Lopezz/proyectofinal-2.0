


const formResetPwd = document.querySelector('form');

formResetPwd?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const password1 = formResetPwd.querySelector('input[name="password1"]').value;
    const password2 = formResetPwd.querySelector('input[name="password2"]').value;

    if (!password1 || !password2 ) {
        alert('Por favor, complete todos los campos.');
        return; 
    }

  

    const response = await fetch('/api/usuarios/newPassword/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        // @ts-ignore
        body: new URLSearchParams(new FormData(formResetPwd)),
    });
   
    if (response.status === 200) { 
        alert('su contraseña ha sido actualizada');
        window.location.href = '/login';
    }
    if (response.status === 400) {
        const error = await response.json()
        alert(error.error)
        
    }
    if (response.status === 404) {
        alert('tiempo excedido para crear nueva contraseña');
        window.location.href = '/resetpassword';
    }
});
