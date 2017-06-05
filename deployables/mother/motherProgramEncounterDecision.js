const programDecision = require('./motherProgramDecision');

module.exports = {};

module.exports.getDecisions = function (programEncounter, today) {
    return programDecision.getDecisions(programEncounter.programEnrolment, today, programEncounter);
};