const { Sequelize, DataTypes } = require('sequelize');

/**
 * 
 * @param {import('../core')} core 
 * @returns {import('sequelize').ModelCtor<Model<any,any>>}
 */
function DefineProject(core) {
    return core.GetSequelize().define('Project', {
        name: DataTypes.STRING(63),
        description: DataTypes.STRING(255),
        isPublic: DataTypes.BOOLEAN(),
        // organizationId: {
        //     allowNull: true,
        //     type: DataTypes.UUID,
        //     references: {
        //         model: 'Organizations',
        //         key: 'id'
        //     }
        // }
    });
}

module.exports = DefineProject;