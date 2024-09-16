import { toPOJO } from '../../utils.js';

export class usuariosDaoMongoose {
    constructor(usuariosModel) {
        this.usuariosModel = usuariosModel;
    }
    async createUsuario(newUser) {
        const usuario = await this.usuariosModel.create(newUser);
        return toPOJO(usuario);
    }

    async findById(id) {
        const usuario = await this.usuariosModel.findById(id);
        return toPOJO(usuario); 
    }

    async findOneUser(datos) {
        const usuario = await this.usuariosModel.find(datos).lean();

        return toPOJO(usuario);
    }
    async findUsersOlds(dosDiasAtras) {
        const usuariosAntiguos = await this.usuariosModel.find({
            last_connection: { $lt: dosDiasAtras },
        });
        return usuariosAntiguos;
    }
    async deleteUsers(dosDiasAtras) {
        const resultado = await this.usuariosModel.deleteMany({
            last_connection: { $lt: dosDiasAtras },
        });
        return resultado;
    }

    async findOneUserMongo(datos) {
    
        const usuario = await this.usuariosModel.findOne(datos);

        return usuario;
    }

    async allUsers() {
        return this.usuariosModel.find({});
    }
    async login(email) {
        return this.usuariosModel.model('usuarios').findOne({ email });
    }
    async findOneAndUpdate(datos) {
        return this.usuariosModel.findOneAndUpdate(datos);
    }
    async findByIdAndUpdate(datos, newPassword) {
        const update = await this.usuariosModel.findByIdAndUpdate(datos, {
            password: newPassword,
        });
        return update;
    }

    async userPremium(userId) {
        const update = await this.usuariosModel.findOneAndUpdate(
            { _id: userId },
            { rol: 'premium' },
            { new: true }
        );

        return update;
    }

    async userUsuario(userId) {
        const update = await this.usuariosModel.findOneAndUpdate(
            { _id: userId },
            { rol: 'usuario' },
            { new: true }
        );

        return update;
    }

    async updateUsuario(id, updateData) {
        return await this.usuariosModel.updateOne({ _id: id }, updateData);
    }
}
