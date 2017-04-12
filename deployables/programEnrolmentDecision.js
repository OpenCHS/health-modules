const programImports = require('./programExports');

const getNextScheduledVisits = function (enrolment) {
    const programEnrolmentImport = programImports.programEnrolmentExports[enrolment.program.name];
    if (programEnrolmentImport === undefined || programEnrolmentImport.getNextScheduledVisits === undefined) return [];
    const nextScheduledVisits = programEnrolmentImport.getNextScheduledVisits();
    console.log('' + nextScheduledVisits.length + ' scheduled visits returned');
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