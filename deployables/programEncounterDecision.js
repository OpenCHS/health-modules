var exports = {};
exports.Mother = require('./mother/programEncounterDecision');

const getDecision = function (programEncounter) {
    let programExports = exports[programEncounter.program.name];
    if (programExports !== undefined)
        return programExports.getDecision(programEncounter);
    return [];
};

const getNextScheduledVisit = function (programEncounter) {
    let programExports = exports[programEncounter.program.name];
    if (programExports !== undefined)
        return programExports.getNextScheduledVisit(programEncounter.programEnrolment);
    return [];
};

module.exports = {
    getDecision: getDecision,
    getNextScheduledVisit: getNextScheduledVisit
};