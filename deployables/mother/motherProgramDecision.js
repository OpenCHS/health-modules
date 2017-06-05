var getNextScheduledVisits = require('./motherVisitSchedule').getNextScheduledVisits;
var C = require('../common');

const getDecisions = function (programEnrolment, today, programEncounter) {
    var decisions = [];
    const pregnancyComplications = [];
    const lmpDate = programEnrolment.getObservationValue('Last Menstrual Period');
    const pregnancyPeriodInWeeks = C.getWeeks(lmpDate, today);

    analyseHypertensiveRisks();
    analyseAnemia();
    manageVaginalBleeding();
    analyseOtherRisks();
    if (pregnancyComplications.length >= 0){
        decisions.push({name: 'Pregnancy Complications', value: pregnancyComplications});
    }
    return decisions;

    function addIfNotExists(conceptName) {
        if (programEnrolment.observationExistsInEntireEnrolment(conceptName))
            pregnancyComplications.push(conceptName);
    }

    function analyseOtherRisks() {
        const height = programEnrolment.getObservationValueFromEntireEnrolment('Height');
        if (height !== undefined && height <= 145)
            addIfNotExists('Short Stature');

        const weight = programEnrolment.getObservationValueFromEntireEnrolment('Weight');
        if (weight !== undefined && weight <= 35)
            addIfNotExists('Underweight');

        if (programEnrolment.individual.getAgeInYears() > 30)
            addIfNotExists('Old age pregnancy');

        if (programEnrolment.getObservationValue('Abortion') > 0)
            addIfNotExists('Previous Abortion');

        if (programEnrolment.getObservationValue('Gravida') >= 5)
            addIfNotExists('Grand Multipara');
    }

    function analyseHypertensiveRisks() {
        const systolic = programEnrolment.getObservationValueFromEntireEnrolment('Systolic');
        const diastolic = programEnrolment.getObservationValueFromEntireEnrolment('Diastolic');
        const urineAlbumen = programEnrolment.getObservationValueFromEntireEnrolment('Urine Albumen');
        const obsHistory = programEnrolment.getObservationValueFromEntireEnrolment('Obstetrics History');

        const mildPreEclempsiaUrineAlbumenValues = ['Trace', '+1', '+2'];
        const severePreEclempsiaUrineAlbumenValues = ['+3', '+4'];

        if (urineAlbumen === undefined)
            decisions.push(C.decision('Investigation Advice', 'Send patient to FRU immediately for Urine Albumen Test'));

        const isBloodPressureHigh = (systolic >= 140) || (diastolic >= 90); //can go in high risk category
        const urineAlbumenIsMild = C.contains(mildPreEclempsiaUrineAlbumenValues, urineAlbumen);
        const urineAlbumenIsSevere = C.contains(severePreEclempsiaUrineAlbumenValues, urineAlbumen);
        const pregnancyInducedHypertension = C.contains(obsHistory, 'Pregnancy Induced Hypertension');
        const hasConvulsions = programEnrolment.getObservationValueFromEntireEnrolment('Convulsions'); //will be identified in hospital
        const isChronicHypertensive = programEnrolment.observationExistsInEntireEnrolment('Chronic Hypertension');

        if (pregnancyPeriodInWeeks <= 20 && isBloodPressureHigh) {
            if (urineAlbumen === 'Absent') pregnancyComplications.push('Chronic Hypertension');
            if (urineAlbumenIsMild || urineAlbumenIsSevere) {
                pregnancyComplications.push('Chronic Hypertension with Superimposed Pre-Eclampsia');
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

    function analyseAnemia() { //anm also does this test
        var hemoglobin = programEnrolment.getObservationValueFromEntireEnrolment('Hb');
        if (hemoglobin === undefined) decisions.push({name: 'Investigation Advice', value: 'Send patient to FRU immediately for Hemoglobin Test'});
        else if (hemoglobin < 7) {
            decisions.push({name: 'Treatment Advice', value: "Severe Anemia. Refer to FRU for further checkup and possible transfusion"});
            pregnancyComplications.push('Severe Anemia');
        } else if (hemoglobin  >= 7 || hemoglobin <= 11){
            pregnancyComplications.push('Moderate Anemia');
            decisions.push({name: 'Treatment Advice', value: "Moderate Anemia. Start therapeutic dose of IFA"});
        } else if ( hemoglobin  > 11)
            decisions.push({name: 'Treatment Advice', value: "Hb normal. Proceed with Prophylactic treatment against anaemia"});
    }

    function manageVaginalBleeding() {
        var vaginalBleeding = programEnrolment.getObservationValueFromEntireEnrolment('Vaginal Bleeding'); // provided this has been informed. during the delivery is difficult.
        if (vaginalBleeding !== undefined && pregnancyPeriodInWeeks > 20) decisions.push({name: 'Referral Advice', value: 'Send patient to FRU immediately'});
        else if (vaginalBleeding && pregnancyPeriodInWeeks <= 20) {
            decisions.push({name: 'Referral Advice', value: "Severe Anemia. Refer to FRU for test"});
            pregnancyComplications.push('Moderate Anemia');
        }
    }
};

module.exports = {
    getDecisions: getDecisions,
    getNextScheduledVisits: getNextScheduledVisits
};
