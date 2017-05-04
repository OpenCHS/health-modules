const programImports = require('./programExports');

const config = function (programName) {
    if (!programName) {
        return programImports.programConfig;
    }

    return programImports.programConfig[programName];
};

module.exports = {
    config: config
};