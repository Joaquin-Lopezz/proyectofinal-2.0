document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const chatToggle = document.getElementById('chat-toggle');
    const chatHeader = document.getElementById('chat-header');

    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    chatHeader.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    const socket = io();

    socket.on('mensaje', (data) => {
        if (data && data.mensaje) {
            const mensajes = document.getElementById('chat-messages');
            const mensaje = document.createElement('div');
            mensaje.innerHTML = `<strong>${data.nombre}:</strong> ${data.mensaje}`;
            mensajes.appendChild(mensaje);
        } else {
            console.error('Mensaje no definido:', data);
        }
    });

    window.enviarMensaje = function() {
        const input = document.getElementById('mensaje');
        const mensaje = input.value.trim();
        if (mensaje) {
            const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Anon';
            socket.emit('mensaje', { nombre: nombreUsuario, mensaje: mensaje });
            input.value = '';
        }
    }
});
