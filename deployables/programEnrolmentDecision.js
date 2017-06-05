const programImports = require('./programExports');

module.exports = {};

module.exports.getDecisions = function (enrolment) {
    return programImports.executeProgramEnrolmentFunc(enrolment, 'getDecisions');
};

module.exports.getNextScheduledVisits = function (enrolment) {
    return programImports.executeProgramEnrolmentFunc(enrolment, 'getNextScheduledVisits');
};

module.exports.getChecklists = function (enrolment) {
    return programImports.executeProgramEnrolmentFunc(enrolment, 'getChecklists');
};