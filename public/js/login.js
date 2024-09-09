const formLogin = document.querySelector('form');

formLogin?.addEventListener('submit', async (event) => {
    event.preventDefault(); // evita la recarga de la pagina

    const response = await fetch('/api/sessions/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },

        body: new URLSearchParams(new FormData(formLogin)),
    });

    if (response.status === 201) {
        window.location.href = '/profile';
    } else {
        const error = await response.json();
        alert(error.message);
    }
});
