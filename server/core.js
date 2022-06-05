/** Importing */
const http              = require('http');
const Express           = require('express');

const { ParseINIFile }        = require('./utils/ini-parser');
const { Sequelize } = require('sequelize');

/**
 * Singletone class
 */
function Core() {
    /** An express app */
    const app       = Express();

    /** Http Server */
    const server    = http.createServer(app);

    /** Configuration defined by /server/config.ini */
    const config    = ParseINIFile(`${__dirname}/config.ini`);

    /** ORM instance */
    const sequelize = new Sequelize(config.database.schema, config.database.user, config.database.password, {
        dialect: "mysql"
    });

    /** Getters */
    this.GetApp     = () => app;
    this.GetServer  = () => server;
    this.GetConfig  = () => config;

    /** Method making server to listen */
    this.Listen = () => server.listen(config.server.listen_port);
}

/** Single instance */
const core = new Core();

/** Exporting */
module.exports = core;