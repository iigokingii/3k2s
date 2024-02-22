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

const Faculty = sequelize.define('Faculty', {
  FACULTY: {
    type: Sequelize.CHAR(10),
    primaryKey: true,
    allowNull: false,
  },
  FACULTY_NAME: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  tableName: 'FACULTY',
  timestamps: false,
});

Faculty.addHook('beforeCreate', (faculty, options) => {
    console.log('Before create hook for Faculty:', faculty);
});

Faculty.addHook('afterCreate', (faculty, options) => {
    console.log('After create hook for Faculty:', faculty);
});

Faculty.addHook('beforeDestroy', (faculty, options) => {
    console.log('Before destroy hook for Faculty:', faculty);
});

async function task5() {
    try {
        const newFaculty = await Faculty.create({
            FACULTY: 'FAC01',
            FACULTY_NAME: 'Example Faculty',
        });

        // Удаление записи
        await newFaculty.destroy();
    } catch (error) {
        console.error(error);
    }
}
//task5();

async function task6() {
    const transaction = await sequelize.transaction();

    try {
        // Изменение во всех аудиториях
        await Auditorium.update(
            { AUDITORIUM_CAPACITY: 0 },
            { where: {}, transaction } // Добавлен атрибут where
        );

        const updatedAuditoriums = await Auditorium.findAll({ transaction });
        console.log('Updated Auditoriums:', updatedAuditoriums);
        await new Promise((resolve) => setTimeout(resolve, 10000));

        await transaction.rollback();

        console.log('Transaction rolled back.');
    } catch (error) {
        await transaction.rollback();
        console.error('Transaction failed:', error);
    }
}

task6();



const Pulpit = sequelize.define('Pulpit', {
  PULPIT: {
    type: Sequelize.CHAR(10),
    primaryKey: true,
    allowNull: false,
  },
  PULPIT_NAME: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  FACULTY: {
    type: Sequelize.CHAR(10),
    allowNull: false,
    references: {
      model: Faculty,
      key: 'FACULTY',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'PULPIT',
  timestamps: false,
});
Faculty.hasMany(Pulpit, { foreignKey: 'FACULTY' });

Pulpit.belongsTo(Faculty, { foreignKey: 'FACULTY' });

const Teacher = sequelize.define('Teacher',{
    TEACHER:{
        type :Sequelize.CHAR(10),
        primaryKey:true,
        allowNull: false,
    },
    TEACHER_NAME:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    PULPIT:{
        type:Sequelize.CHAR(10),
        allowNull:false,
        references:{
            model:Pulpit,
            key:'PULPIT',
        },
        onDelete:'CASCADE',
    },
},{
    tableName:'TEACHER',
    timestamps:false,
})

Teacher.belongsTo(Pulpit,{foreignKey:'PULPIT'})

const Subject = sequelize.define('Subject',{
    SUBJECT:{
        type:Sequelize.CHAR(10),
        primaryKey:true,
        allowNull:false,
    },
    SUBJECT_NAME:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    PULPIT:{
        type:Sequelize.CHAR(10),
        allowNull:false,
        references:{
            model:Pulpit,
            key:'PULPIT'
        },
        onDelete:'CASCADE',
    },
},{
    tableName:'SUBJECT',
    timestamps:false,
})

Subject.belongsTo(Pulpit,{foreignKey:'PULPIT'})

const AuditoriumType = sequelize.define('AuditoriumType',{
    AUDITORIUM_TYPE:{
        type:Sequelize.CHAR(10),
        primaryKey:true,
        allowNull:false,
    },
    AUDITORIUM_TYPENAME:{
        type:Sequelize.STRING,
        allowNull:false,
    }
},{
    tableName:'AUDITORIUM_TYPE',
    timestamps:false,
})

const Auditorium = sequelize.define('Auditorium',{
    AUDITORIUM:{
        type:Sequelize.CHAR(10),
        allowNull:false,
        primaryKey:true,
    },
    AUDITORIUM_NAME:{
        type:Sequelize.STRING,
    },
    AUDITORIUM_CAPACITY:{
        type:Sequelize.NUMBER,
    },
    AUDITORIUM_TYPE:{
        type:Sequelize.CHAR(10),
        allowNull:false,
        references:{
            model:AuditoriumType,
            key:'AUDITORIUM_TYPE'
        },
        onDelete:'CASCADE',
    },

},{
    tableName:'AUDITORIUM',
    timestamps:false,
})

Auditorium.addScope('capacityRange', {
    where: {
        AUDITORIUM_CAPACITY: {
            [Sequelize.Op.between]: [10, 60],
        },
    },
});

AuditoriumType.hasMany(Auditorium, { foreignKey: 'AUDITORIUM_TYPE' });



module.exports = {
    Faculty,
    Pulpit,
    Teacher,
    Subject,
    AuditoriumType,
    Auditorium
};