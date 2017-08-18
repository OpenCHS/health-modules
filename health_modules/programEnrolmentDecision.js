const programImports = require('./programExports');

module.exports = {};

module.exports.getDecisions = function (enrolment) {
    return programImports.execute({parameter: enrolment, type: "enrolment", fn: "getDecisions", defaultValue: {enrolmentDecisions: [], encounterDecisions: [], registrationDecisions: []}})
};

module.exports.getNextScheduledVisits = function (enrolment) {
    return programImports.execute({parameter: enrolment, type: "enrolment", fn: "getNextScheduledVisits"})
};

module.exports.getChecklists = function (enrolment) {
    return programImports.execute({parameter: enrolment, type: "enrolment", fn: "getChecklists"});
};

module.exports.validate = function (enrolment) {
    return programImports.execute({parameter: enrolment, type: "enrolment", fn: "validate"});
};