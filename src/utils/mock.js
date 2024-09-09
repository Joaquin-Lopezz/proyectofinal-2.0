import { fakerES as faker } from '@faker-js/faker';

// Función para generar un solo producto
export const generateProduct = () => {
    return {
        _id: Math.random().toString(36).substring(2), // Genera un ID aleatorio
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        thumbnail: faker.image.url(), // Nueva función para generar URL de imagen
        code: faker.string.alphanumeric(10), // Nueva función para generar código alfanumérico
        stock: faker.number.int({ min: 0, max: 100 }), // Nueva función para generar stock
        category: faker.commerce.department(),
        status: faker.helpers.arrayElement(['true']),
    };
};

// Función para generar productos
export const generateProducts = (numProducts = 10) => {
    const products = [];
    for (let i = 0; i < numProducts; i++) {
        products.push(generateProduct());
    }
    return products;
};
    

