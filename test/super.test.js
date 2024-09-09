import supertest from 'supertest';
import { expect } from 'chai';
import { MONGODB_CNX_STR } from '../src/config.js';
import mongoose from 'mongoose';

const requester = supertest('http://localhost:8080');

before(async () => {
    // Conectar a la base de datos
    await mongoose.connect(MONGODB_CNX_STR);
});

afterEach(async function () {
    this.timeout(10000);
    // Limpiar colecciones después de cada prueba
    const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
    await mongoose.connection.db.collection('productos').deleteMany({});
    await mongoose.connection.db.collection('carritos').deleteMany({});
    await mongoose.connection.db.collection('sessions').deleteMany({});
    await mongoose.connection.db.collection('usuarios').deleteMany({});
});
after(async () => {
    // Desconectar de la base de datos
    await mongoose.disconnect();
});

describe('Testing productos:', () => {
    describe('Agregar un producto:', () => {
        it('debería agregar un producto correctamente', async () => {
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
            const { statusCode, body } = await requester
                .post('/api/products')
                .send(producto);
            expect(statusCode).to.equal(200);
            expect(body).to.have.property('_id');
            expect(body).to.have.property('title', 'Casa');
            // Validaciones adicionales de los campos
        });
    });

    describe('Obtener productos:', () => {
        it('debería obtener una lista de productos', async () => {
            const { statusCode, body } = await requester.get('/api/products');
            expect(statusCode).to.equal(200);
            expect(body).to.be.an('array');
            body.forEach((producto) => {
                expect(producto).to.have.property('_id');
                expect(producto).to.have.property('title');
                // Validaciones adicionales de los campos
            });
        });
    });

    describe('Eliminar un producto:', () => {
        it('debería eliminar un producto correctamente', async () => {
            const producto = {
                title: 'Auto',
                description: 'Descripción del auto',
                price: 15000,
                thumbnail: 'url-de-imagen',
                code: `unique-code-${Date.now()}`,
                stock: 5,
                category: 'Vehículos',
                status: true,
                owner: 'user@example.com',
            };
            const { body: productoAgregado } = await requester
                .post('/api/products')
                .send(producto);
            const { _id } = productoAgregado;
            const { statusCode, body } = await requester.delete(
                `/api/products/${_id}`
            );
            expect(statusCode).to.equal(200);
            expect(body)
                .to.have.property('message')
                .that.includes('Se eliminó el producto');
        });
    });
});

describe('testing carritos:', () => {
    describe('Crear un producto:', () => {
        it('crear carrito', async () => {
            const { statusCode, ok, body } = await requester.post(
                '/api/carts/:userId'
            );
            expect(statusCode).to.equal(200);
            expect(ok).to.be.true;
            expect(body).to.be.an('object'); // Espera un objeto en lugar de un array
            expect(body).to.have.property('carrito');
            expect(body.carrito).to.be.an('object'); // Asegúrate de que 'carrito' sea un objeto
        });
    });

    describe('Agregar un producto al carrito:', () => {
        it('debería agregar un producto al carrito correctamente', async () => {
            // Primero, crea un carrito para agregar productos
            const carritoResponse = await requester.post('/api/carts/1234');

            const carritoId = carritoResponse.body.carrito._id;

            // Luego, agrega un producto al carrito
            const producto = {
                producto: {
                    _id: 'ofdskafok34',
                    title: 'casa',
                    description: 'adsfads',
                    price: 4241,
                    thumbnail: 'dsa234',
                    code: `unique-code-${Date.now()}`,
                    stock: 3241,
                    category: 'dsfa',
                    status: true,
                    owner: 'joaquin.ariel.lopez.98@gmail.com',
                },
            };

            const { statusCode, ok, body } = await requester
                .post(`/api/carts/addProduct/${carritoId}`)
                .send(producto);

            expect(statusCode).to.equal(200);
            expect(ok).to.be.true;
            expect(body).to.be.an('object');
            expect(body).to.have.property('carrito');
            expect(body.carrito).to.be.an('object'); // O ajusta según la estructura que devuelves
        });
    });
    describe('Eliminar un producto del carrito:', () => {
        it('debería eliminar un producto del carrito correctamente', async () => {
            // Primero, crea un carrito para agregar productos
            const carritoResponse = await requester.post('/api/carts/1234');
            const carritoId = carritoResponse.body.carrito._id;

            // Luego, agrega un producto al carrito
            const producto = {
                producto: {
                    _id: 'ofdskafok34',
                    title: 'casa',
                    description: 'adsfads',
                    price: 4241,
                    thumbnail: 'dsa234',
                    code: `unique-code-${Date.now()}`,
                    stock: 3241,
                    category: 'dsfa',
                    status: true,
                    owner: 'joaquin.ariel.lopez.98@gmail.com',
                },
            };
            await requester
                .post(`/api/carts/addProduct/${carritoId}`)
                .send(producto);

            // Luego, elimina el producto agregado
            const { statusCode, ok, body } = await requester.delete(
                `/api/carts/${carritoId}/ofdskafok34`
            );
            expect(statusCode).to.equal(200);
            expect(ok).to.be.true;
            expect(body).to.be.an('object'); // Ajusta según la estructura que devuelves
            expect(body).to.have.property('_id');
        });
    });
});

describe('Testing sesiones:', () => {
    describe('Iniciar sesión:', () => {
        it('debería iniciar sesión correctamente', async () => {
            const datos = {
                nombre: 'x',
                apellido: 'x',
                email: 'x@x.com',
                password: '1234',
            };
            await requester.post('/api/usuarios').send(datos);
            const { statusCode, text } = await requester
                .post('/api/sessions')
                .send({ email: 'x@x.com', password: '1234' });
            const body = JSON.parse(text);
            expect(statusCode).to.equal(201);
            expect(body).to.have.property('message', 'login success');
        });

        it('debería fallar con credenciales incorrectas', async () => {
            const credentials = {
                username: 'usuario',
                password: 'password',
            };
            const { statusCode, body } = await requester
                .post('/api/sessions')
                .send(credentials);
            expect(statusCode).to.equal(401);
            expect(body).to.have.property('status', 'error');
            expect(body).to.have.property('message');
        });
    });

    describe('Obtener sesión actual:', function () {
        this.timeout(5000);
        it('debería obtener la sesión actual', async function () {
            const datos = {
                nombre: 'x',
                apellido: 'x',
                email: 'x@x.com',
                password: '1234',
            };
            // Registrar el usuario
            await requester.post('/api/usuarios').send(datos);
            const loginResponse = await requester
                .post('/api/sessions')
                .send({ email: 'x@x.com', password: '1234' });
            const cookies = loginResponse.headers['set-cookie'];
            const response = await requester
                .get('/api/usuarios/current')
                .set('Cookie', cookies);
            const { statusCode, body } = response;
            expect(statusCode).to.equal(200);
            expect(body).to.have.property('payload');
        });
    });

    describe('Cerrar sesión:', () => {
        it('debería cerrar sesión correctamente', async () => {
            const credentials = {
                username: 'testuser',
                password: 'testpassword',
            };
            await requester.post('/api/sessions').send(credentials);
            const { statusCode, body } = await requester.delete(
                '/api/sessions/current'
            );
            expect(statusCode).to.equal(200);
            expect(body).to.have.property('status', 'success');
            expect(body).to.have.property('message', 'logout OK');
        });
    });
});
