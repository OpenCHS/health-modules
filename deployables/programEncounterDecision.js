const allExports = require('./programExports');

const getDecisions = function (programEncounter) {
    const programExports = allExports[programEncounter.program.name];
    if (programExports !== undefined)
        return programExports.getDecisions(programEncounter);
    return [];
};

const getNextScheduledVisits = function (programEncounter) {
    const programExports = allExports[programEncounter.program.name];
    if (programExports !== undefined)
        return programExports.getNextScheduledVisits(programEncounter.programEnrolment);
    return [];
};

module.exports = {
    getDecisions: getDecisions,
    getNextScheduledVisits: getNextScheduledVisits
};