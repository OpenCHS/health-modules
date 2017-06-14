const programDecision = require('./motherProgramDecision');
var C = require('../common');

module.exports = {};

module.exports.getDecisions = function (programEncounter, today) {
    var decisions = programDecision.getDecisions(programEncounter.programEnrolment, today, programEncounter);
    
    const previousEncounter = programEncounter.programEnrolment.findPreviousEncounter(programEncounter);

    const currentWeight = programEncounter.getObservationValue("Weight");
    const currentWeightRecordDate = programEncounter.encounterDateTime;
    const previousWeight = previousEncounter.getObservationValue("Weight");
    const previousWeightRecordDate = previousEncounter.encounterDateTime;
    const weightGain = currentWeight - previousWeight;

    const daysBetweenCurrentAndPreviousWeightRecord = C.getDays(currentWeightRecordDate, previousWeightRecordDate);


    return decisions;
};

module.exports.getNextScheduledVisits = function (programEncounter, today) {
    return programDecision.getNextScheduledVisits(programEncounter.programEnrolment, today, programEncounter);
};