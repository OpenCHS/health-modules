const programExports = require('./programExports');

const getNextScheduledVisits = function (enrolment) {
    const programEnrolmentExports = programExports.programEnrolmentExports[enrolment.program.name];
    if (programEnrolmentExports === undefined) return null;
    const nextScheduledVisits = programEnrolmentExports.getNextScheduledVisits();
    console.log('' + nextScheduledVisits.length + ' scheduled visits returned');
};

module.exports = {
    getNextScheduledVisits: getNextScheduledVisits
};
