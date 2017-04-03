const programExports = require('./programExports');

const getNextScheduledDate = function (enrolment) {
    const programEncounterExport = programExports.programEncounterExports[enrolment.program.name];
    if (programEncounterExport === undefined) return null;
    return programEncounterExport.getNextScheduledVisit();
};

module.exports = {
    getNextScheduledDate: getNextScheduledDate
};
