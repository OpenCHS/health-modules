const programExports = require('./programExports');

const getNextScheduledVisits = function (enrolment) {
    const programEncounterExport = programExports.programEncounterExports[enrolment.program.name];
    if (programEncounterExport === undefined) return null;
    return programEncounterExport.getNextScheduledVisits();
};

module.exports = {
    getNextScheduledVisits: getNextScheduledVisits
};
