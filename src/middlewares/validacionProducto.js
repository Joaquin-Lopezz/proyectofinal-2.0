export async function eliminacionCaracteresNoDesados(newProduct) {
    const keys = Object.keys(newProduct);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (typeof newProduct[key] === 'string') 
        newProduct[key] = newProduct[key]
            .trim()
            .replace(/<[^>]*>|["=]|[:]|[<>]/g, '');
    }

    return newProduct;
}

