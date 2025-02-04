const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();

const sequalize = new Sequelize("functionApp", process.env.DB_USER, process.env.DB_PASS, {
    dialect: "mssql",
    host: "localhost",
    port: 1433
});

const Person = sequalize.define('Person', {
    idPerson: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    }, name: {
        type: DataTypes.STRING,
        allowNull: false
    }, secondName: {
        type: DataTypes.STRING,
        allowNull: true
    }, firstSurname: {
        type: DataTypes.STRING,
        allowNull: false
    }, secondSurname: {
        type: DataTypes.STRING,
        allowNull: false
    }, birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }, area: DataTypes.STRING
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: "Person"
});

async function valConnection() {
    try {
        await sequalize.authenticate()
        console.log("Conectado a la BD");
    } catch (error) {
        console.log(error)
    }
}

async function syncDB() {
    await sequalize.sync();
    console.log("BD sincronizada")
}

valConnection();
syncDB();

module.exports=Person;