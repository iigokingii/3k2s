const Sequelize = require('sequelize');
const sequelize = new Sequelize('SVA', 'student', 'fitfit', {
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
});

module.exports = sequelize;