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

    const monthsBetweenCurrentAndPreviousWeightRecord = C.getDays(currentWeightRecordDate, previousWeightRecordDate)/30;

    if(monthsBetweenCurrentAndPreviousWeightRecord >= 1){

        function addComplication(conceptName) {
            console.log('(MotherProgramEncounterDecision) Adding if not exists to preg complications: ' + conceptName);
            var pregnancyComplications = C.findValue(decisions, 'Pregnancy Complications');
            if (pregnancyComplications === undefined){
                pregnancyComplications = [];
                decisions.push({name: 'Pregnancy Complications', value: pregnancyComplications})
            }
            pregnancyComplications.push(conceptName);
        }

        const weightGainPerMonth = weightGain / monthsBetweenCurrentAndPreviousWeightRecord;
        if(weightGainPerMonth < 1){
            addComplication('Weight Gain Per Month less than 1kg');
        }else if(weightGainPerMonth > 1.5){
            addComplication('Weight Gain Per Month more than 1.5kg');
        }
    }

    return decisions;
};



module.exports.getNextScheduledVisits = function (programEncounter, today) {
    return programDecision.getNextScheduledVisits(programEncounter.programEnrolment, today, programEncounter);
};