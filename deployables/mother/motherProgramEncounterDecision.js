//var getNextScheduledVisits = require('./motherVisitSchedule').getNextScheduledVisits;
var C = require('../common');

const getDecisions = function (programEncounter, today) {

    var decisions = [];
    const pregnancyComplications = [];
    const lmpDate = programEncounter.programEnrolment.getObservationValue('Last Menstrual Period');
    const pregnancyPeriodInWeeks = C.getWeeks(lmpDate, today);

    manageHypertensiveRisks(programEncounter);
    manageAnemia(programEncounter);
    if (pregnancyComplications.length >= 0){
        decisions.push({name: 'Pregnancy Complications', value: pregnancyComplications});
        return decisions;
    }

    function manageHypertensiveRisks(progEncounter) {

        const systolic = programEncounter.getObservationValueFromEntireEnrolment('Systolic');
        const diastolic = programEncounter.getObservationValueFromEntireEnrolment('Diastolic');
        const urineAlbumen = progEncounter.getObservationValueFromEntireEnrolment('Urine Albumen');
        const mildPreEclempsiaUrineAlbumenValues = ['Trace', '+1', '+2'];
        const severePreEclempsiaUrineAlbumenValues = ['+3', '+4'];

        if (urineAlbumen === undefined)
            decisions.push(C.decision('Investigation Advice', 'Send patient to FRU immediately for Urine Albumen Test'));

        const isBloodPressureHigh = (systolic >= 140) || (diastolic >= 90); //can go in high risk category
        const urineAlbumenIsMild = C.contains(mildPreEclempsiaUrineAlbumenValues, urineAlbumen);
        const urineAlbumenIsSevere = C.contains(severePreEclempsiaUrineAlbumenValues, urineAlbumen);
        const pregnancyInducedHypertension = progEncounter.observationExistsInEntireEnrolment('Pregnancy Induced Hypertension');
        const hasConvulsions = progEncounter.getObservationValueFromEntireEnrolment('Convulsions'); //will be identified in hospital
        const isChronicHypertensive = progEncounter.observationExistsInEntireEnrolment('Chronic Hypertension');

        if (pregnancyPeriodInWeeks <= 20 && isBloodPressureHigh) {
            if (urineAlbumen === 'Absent') pregnancyComplications.push('Chronic Hypertension');
            if (urineAlbumenIsMild || urineAlbumenIsSevere) {
                pregnancyComplications.push('Chronic Hypertension with Superimposed Pre-Eclampsia');
                decisions.push(C.decision('Delivery Recommendation', 'Hospital', 'ProgramEnrolment'))
            }
        } else if (pregnancyPeriodInWeeks > 20 && !isChronicHypertensive) {
            if (!pregnancyInducedHypertension && isBloodPressureHigh){
                pregnancyComplications.push('Pregnancy Induced Hypertension');
                if (hasConvulsions && (urineAlbumenIsMild || urineAlbumenIsSevere))
                    pregnancyComplications.push('Eclampsia');
                else if (!hasConvulsions && urineAlbumenIsMild) pregnancyComplications.push('Mild Pre-Eclampsia');
                else if (!hasConvulsions && urineAlbumenIsSevere) pregnancyComplications.push('Severe Pre-Eclampsia');
            }
        }
    }

    function manageAnemia(programEncounter) { //anm also does this test
        var hemoglobin = programEncounter.getObservationValueFromEntireEnrolment('Hb');
        if (hemoglobin === undefined) decisions.push({name: 'Investigation Advice', value: 'Send patient to FRU immediately for Hemoglobin Test'});
        else if (hemoglobin < 7) {
            decisions.push({name: 'Referral', value: "Severe Anemia. Refer to FRU for further checkup and possible transfusion"});
            decisions.push(C.decision('Delivery Recommendation', 'Hospital', 'ProgramEnrolment'));
            pregnancyComplications.push('Severe Anemia');
        } else if (hemoglobin  >= 7 || hemoglobin <= 11){
            pregnancyComplications.push('Moderate Anemia, requiring treatment');
            decisions.push({name: 'Treatment Advice', value: "Moderate Anemia. Start therapeutic dose of IFA"});
        } else if ( hemoglobin  > 11)
            decisions.push({name: 'Treatment Advice', value: "Hb normal. Proceed with Prophylactic treatment against anaemia"});
    }

    function manageVaginalBleeding(programEncounter) {
        var vaginalBleeding = programEncounter.getObservationValueFromEntireEnrolment('Vaginal Bleeding'); // provided this has been informed. during the delivery is difficult.
        if (vaginalBleeding !== undefined && pregnancyPeriodInWeeks > 20) decisions.push({name: 'Referral', value: 'Send patient to FRU immediately'});
        else if (vaginalBleeding && pregnancyPeriodInWeeks <= 20) {
            decisions.push({name: 'Referral', value: "Severe Anemia. Refer to FRU for test"});
            decisions.push(C.decision('Delivery Recommendation', 'Hospital', 'ProgramEnrolment'));
            pregnancyComplications.push('Moderate Anemia');
        }
    }
};

module.exports = {
    getDecisions: getDecisions
    //getNextScheduledVisits: getNextScheduledVisits
};
