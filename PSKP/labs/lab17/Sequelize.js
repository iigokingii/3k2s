const Sequelize = require('sequelize');

const sequelize = new Sequelize('lab17', 'SA', '1111', {
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
});

const Users = sequelize.define('Users', {
    USER_ID: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    USERNAME: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    PASSWORD:{
        type:Sequelize.STRING,
        allowNull:false,
    }
}, {
    tableName: 'USERS_DB_FOR_LAB',
    timestamps: false,
});
async function createTableAndSyncModel() {
    try {
        await Users.sync();
        console.log('Таблица создана и модель синхронизирована успешно.');
    } catch (error) {
        console.error('Ошибка при создании таблицы и синхронизации модели:', error);
    }
}

//createTableAndSyncModel();

module.exports = {
    sequelize,
    Users
};