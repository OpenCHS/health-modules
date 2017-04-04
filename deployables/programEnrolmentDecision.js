const programExports = require('./programExports');

const getNextScheduledVisits = function (enrolment) {
    const programEnrolmentExports = programExports.programEnrolmentExports[enrolment.program.name];
    if (programEnrolmentExports === undefined) return null;
    return programEnrolmentExports.getNextScheduledVisits();
};

module.exports = {
    getNextScheduledVisits: getNextScheduledVisits
};
