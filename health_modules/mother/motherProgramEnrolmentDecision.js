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

    const gravida = programEnrolment.getObservationValue('Gravida');
    const parity = programEnrolment.getObservationValue('Parity');
    const number_of_abortion = programEnrolment.getObservationValue('Number of abortion');

    if(gravida !== undefined && parity !== undefined && parity > gravida){
        validationResults.push(c.createValidationError('parityCannotBeGreaterThanGravida'));
    }
    if(gravida !== undefined && number_of_abortion !== undefined && number_of_abortion > gravida){
        validationResults.push(c.createValidationError('abortionsCannotBeGreaterThanGravida'));
    }
    if(gravida !== undefined && parity !== undefined && number_of_abortion!== undefined && (parity + number_of_abortion) > gravida){
        validationResults.push(c.createValidationError('parityPlusAbortionCannotBeGreaterThanGravida'));
    }

    return validationResults;
};