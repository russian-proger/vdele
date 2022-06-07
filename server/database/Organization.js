const { Sequelize, DataTypes } = require('sequelize');

/**
 * 
 * @param {import('../core')} core 
 * @returns {import('sequelize').ModelCtor<Model<any,any>>}
 */
function DefineOrganization(core) {
    return core.GetSequelize().define('Organization', {
        name: DataTypes.STRING(63),
        description: DataTypes.STRING(255),
        photoName: DataTypes.STRING(255),
        isPublic: DataTypes.BOOLEAN
    });
}

module.exports = DefineOrganization;