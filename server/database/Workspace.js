const { Sequelize, DataTypes } = require('sequelize');

/**
 * 
 * @param {import('../core')} core 
 * @returns {import('sequelize').ModelCtor<Model>}
 */
function DefineWorkspace(core) {
    return core.GetSequelize().define('Workspace', {
        name: DataTypes.STRING(63)
    });
}

module.exports = DefineWorkspace;