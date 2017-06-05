const motherVisitSchedule = require('./motherVisitSchedule');
const programDecision = require('./motherProgramDecision');

module.exports = {};

module.exports.getNextScheduledVisits = function (enrolment, today) {
    return motherVisitSchedule.getNextScheduledVisits(enrolment, today);
};

module.exports.getDecisions = function (enrolment, today) {
    return programDecision.getDecisions(enrolment, today);
};