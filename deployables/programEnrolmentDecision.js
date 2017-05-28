const programImports = require('./programExports');

const getNextScheduledVisits = function (enrolment) {
    const programEnrolmentImport = programImports.programEnrolmentExports[enrolment.program.name];
    if (programEnrolmentImport === undefined) {
        console.log('(ProgramEnrolmentDecision) No program enrolment rule set for program: ' + enrolment.program.name);
        return [];
    }
    if (programEnrolmentImport.getNextScheduledVisits === undefined) {
        console.log('(ProgramEnrolmentDecision) No rule for nextScheduledVisit for program: ' + enrolment.program.name);
        return [];
    }

    const nextScheduledVisits = programEnrolmentImport.getNextScheduledVisits(enrolment);
    console.log('(ProgramEnrolmentDecision) ' + nextScheduledVisits.length + ' scheduled visits returned');
    return nextScheduledVisits;
};

const getChecklists = function (enrolment) {
    const programEnrolmentImport = programImports.programEnrolmentExports[enrolment.program.name];
    if (programEnrolmentImport === undefined || programEnrolmentImport.getChecklists === undefined) return [];
    return programEnrolmentImport.getChecklists(enrolment);
};

module.exports = {
    getNextScheduledVisits: getNextScheduledVisits,
    getChecklists: getChecklists
};