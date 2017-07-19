var C = require('../common');

module.exports = {};
module.exports.getNextScheduledVisits = require('./motherVisitSchedule').getNextScheduledVisits;

module.exports.getDecisions = function (programEnrolment, today, programEncounter) {
    var decisions = [];
    const pregnancyComplications = [];


    analyseOtherRisks();

    if (pregnancyComplications.length >= 0){
        decisions.push({name: 'Pregnancy Complications', value: pregnancyComplications});
    }
    return decisions;

    function addIfNotExists(conceptName) {
        console.log('(MotherProgramDecision) Adding if not exists to preg complications: ' + conceptName);
        if (!observationExistsInEntireEnrolment(conceptName))
            pregnancyComplications.push(conceptName);
    }
    
    function getObservationValueFromEntireEnrolment(conceptName) {
        return programEnrolment.getObservationValueFromEntireEnrolment(conceptName, programEncounter);
    }
    
    function observationExistsInEntireEnrolment(conceptName) {
        return programEnrolment.getObservationValueFromEntireEnrolment(conceptName, programEncounter);
    }

    function analyseOtherRisks() {
        const height = getObservationValueFromEntireEnrolment('Height');
        if (height !== undefined && height <= 145)
            addIfNotExists('Short Stature');

        const weight = getObservationValueFromEntireEnrolment('Weight');
        if (weight !== undefined && weight <= 35)
            addIfNotExists('Underweight');

        if (programEnrolment.individual.getAgeInYears() > 30)
            addIfNotExists('Old age pregnancy');

        if (programEnrolment.individual.getAgeInYears() < 18)
            addIfNotExists('Under age pregnancy');

        if (programEnrolment.getObservationValue('Number of abortion') > 0)
            addIfNotExists('Previous Abortion');

        if (programEnrolment.getObservationValue('Gravida') >= 5)
            addIfNotExists('Grand Multipara');
    }
};