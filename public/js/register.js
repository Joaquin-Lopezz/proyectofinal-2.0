const formRegister = document.querySelector('form');

formRegister?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await fetch('/api/sessions/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        // @ts-ignore
        body: new URLSearchParams(new FormData(formRegister)),
       
    });

    if (response.status === 201) {
        window.location.href = '/profile';
    } else {
        alert('ya existe un usuario registrado con ese mail');
    }
});
