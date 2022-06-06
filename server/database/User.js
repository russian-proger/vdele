const { Sequelize, DataTypes } = require('sequelize');

/**
 * 
 * @param {import('../core')} core 
 * @returns {import('sequelize').ModelCtor<Model<any,any>>}
 */
function DefineUser(core) {
    return core.GetSequelize().define('User', {
        nick: DataTypes.STRING(63),
        mail: DataTypes.STRING(63),
        password:   DataTypes.STRING(63),
        firstName: DataTypes.STRING(63),
        lastName:  DataTypes.STRING(63),
        photoName: DataTypes.STRING(255),
    });
}

module.exports = DefineUser;