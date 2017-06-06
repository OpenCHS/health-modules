const programDecision = require('./motherProgramDecision');

module.exports = {};

module.exports.getDecisions = function (programEncounter, today) {
    return programDecision.getDecisions(programEncounter.programEnrolment, today, programEncounter);
};

module.exports.getNextScheduledVisits = function (programEncounter, today) {
    return programDecision.getNextScheduledVisits(programEncounter.programEnrolment, today, programEncounter);
};