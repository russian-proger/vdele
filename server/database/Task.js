const { Sequelize, DataTypes } = require('sequelize');

/**
 * 
 * @param {import('../core')} core 
 * @returns {import('sequelize').ModelCtor<Model<any,any>>}
 */
function DefineTask(core) {
    return core.GetSequelize().define('Task', {
        name: DataTypes.STRING(63),
        description: DataTypes.STRING(255),
    });
}

module.exports = DefineTask;