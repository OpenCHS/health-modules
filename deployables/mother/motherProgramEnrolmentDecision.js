const motherVisitSchedule = require('./motherVisitSchedule');
const programDecision = require('./motherProgramDecision');
const c = require('../common');

module.exports = {};

module.exports.getNextScheduledVisits = function (enrolment, today) {
    return motherVisitSchedule.getNextScheduledVisits(enrolment, today);
};

module.exports.getDecisions = function (enrolment, today) {
    return programDecision.getDecisions(enrolment, today);
};

module.exports.validate = function (programEnrolment, today) {
    const validationResults = [];

    if (programEnrolment.individual.gender === 'Male')
        validationResults.push(c.createValidationError('maleCannotBeEnrolledInMotherProgram'));
    else if (programEnrolment.individual.getAgeInYears() < 11)
        validationResults.push(c.createValidationError('lowerThanAgeOfBeingAMother'));

    return validationResults;
};