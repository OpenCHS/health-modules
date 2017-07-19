const allImports = require('./programExports');

module.exports = {};

module.exports.getDecisions = function (programEncounter) {
    return allImports.executeProgramEncounterFunc(programEncounter, 'getDecisions');
};

module.exports.getNextScheduledVisits = function (programEncounter) {
    return allImports.executeProgramEncounterFunc(programEncounter, 'getNextScheduledVisits');
};