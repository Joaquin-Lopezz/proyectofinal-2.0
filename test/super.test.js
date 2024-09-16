import supertest from 'supertest';
import { expect } from 'chai';
import { MONGODB_CNX_STR } from '../src/config.js';
import mongoose from 'mongoose';

const requester = supertest('http://localhost:8080');

before(function (done) {
    this.timeout(10000);
    mongoose
        .connect(MONGODB_CNX_STR)
        .then(() => done())
        .catch(done);
});

after(function (done) {
    this.timeout(20000);
    Promise.all([
        mongoose.connection.db.collection('productos').deleteMany({}),
        mongoose.connection.db.collection('carritos').deleteMany({}),
        mongoose.connection.db.collection('sessions').deleteMany({}),
        mongoose.connection.db.collection('usuarios').deleteMany({}),
    ])
        .then(() => mongoose.disconnect())
        .then(() => done())
        .catch(done);
});

describe('Testing sesiones:', () => {
    let usuarioId;
    let productoId;
    let carritoId;

    describe('registrarse', () => {
        it('registra usuario', async () => {
            const datos = {
                nombre: 'x',
                apellido: 'x',
                email: 'x@x.com',
                password: '1234',
                rol: 'premium',
            };

            const res = await requester
                .post('/api/sessions/register')
                .send(datos);

            usuarioId = res.body.user._id;
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status').that.equals('success');
            expect(res.body)
                .to.have.property('message')
                .that.equals('Registro exitoso');
            expect(res.body.user)
                .to.have.property('email')
                .that.equals('x@x.com');
        });
    });

    describe('Iniciar sesión:', () => {
        it('debería fallar con credenciales incorrectas', async () => {
            const credentials = {
                username: 'usuario',
                password: 'password',
            };
            const { statusCode, body } = await requester
                .post('/api/sessions')
                .send(credentials);
            expect(statusCode).to.equal(404);
        });

        it('debería iniciar sesión correctamente', async () => {
            const datos = {
                email: 'x@x.com',
                password: '1234',
            };

            const res = await requester.post('/api/sessions/login').send(datos);

            carritoId = res.body.user.cart;
            expect(res.status).to.equal(201); // Ajusta el código de estado a 200 si es necesario
            expect(res.body)
                .to.have.property('message')
                .that.equals('login success');
        });
    });

    describe('cambio el rol de usuario a premium', () => {
        it('debería cambio el rol de usuario a premium', async () => {
            const res = await requester
                .post(`/api/users/premium/${usuarioId}`)
                .send({ user: { rol: 'usuario' } });

            expect(res.status).to.equal(200); // Ajusta el código de estado a 200 si es necesario
            expect(res.body)
                .to.have.property('message')
                .that.equals('rol actualizado a premium');
        });
    });

    describe('Testing productos:', () => {
        it('Agregar un producto:', async () => {
            const producto = {
                title: 'Casa',
                description: 'Descripción de la casa',
                price: 4241,
                thumbnail: 'url-de-imagen',
                code: `unique-code-${Date.now()}`,
                stock: 10,
                category: 'Inmuebles',
                status: true,
                owner: 'user@example.com',
            };

            const req = await requester
                .post('/api/products')
                .set('x-test-mode', 'true')
                .send(producto);

            productoId = req.body._id; // Mostrar el cuerpo de la respuesta

            expect(req.statusCode).to.equal(200);
            expect(req.body).to.have.property('_id');
            expect(req.body).to.have.property('title', 'Casa');
        });

        it('debería obtener una lista de productos', async () => {
            const { statusCode, body } = await requester
                .get('/api/products')
                .set('x-test-mode', 'true');

            // Mostrar el cuerpo de la respuesta

            expect(statusCode).to.equal(200);
            expect(body).to.be.an('array');
            body.forEach((producto) => {
                expect(producto).to.have.property('_id');
                expect(producto).to.have.property('title');
            });
        });
    });

    describe('testing de carrito', () => {
        it('agrega un producto al carrito', async () => {
            const req = await requester
                .post(`/api/carts/${carritoId}/producto/${productoId}`)
                .set('x-test-mode', 'true');
            expect(req.statusCode).to.equal(200);
            expect(req.body).to.have.property('carrito');
        });

        it('elimina un producto del carrito', async () => {
            const req = await requester
                .delete(`/api/carts/${carritoId}/${productoId}`)
                .set('x-test-mode', 'true');
            expect(req.statusCode).to.equal(200);
            expect(req.body).to.have.property('status');
        });
    });

    describe('Cerrar sesión:', () => {
        it('debería cerrar sesión correctamente', async () => {
            const { statusCode, body } = await requester.delete(
                '/api/sessions/current'
            );
            expect(statusCode).to.equal(200);
            expect(body).to.have.property('status', 'success');
            expect(body).to.have.property('message', 'logout OK');
        });
    });
});
