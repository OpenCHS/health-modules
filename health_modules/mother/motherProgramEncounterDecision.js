const programDecision = require('./motherProgramDecision');
var C = require('../common');

module.exports = {};

module.exports.getDecisions = function (programEncounter, today) {
    if(programEncounter.encounterType.name === 'ANC') {

        var decisions = programDecision.getDecisions(programEncounter.programEnrolment, today, programEncounter);

        const lmpDate = programEncounter.programEnrolment.getObservationValue('Last Menstrual Period');
        const pregnancyPeriodInWeeks = C.getWeeks(lmpDate, today);

        //TODO this code has duplications. Refactoring to be done. Externalise strings?
        analyseHypertensiveRisks();
        analyseAnemia();
        manageVaginalBleeding();
        analyseSexuallyTransmittedDisease();
        analyseSickling();
        analyseHepatitisB();
        analyseMalaria();
        analyseFoetalPresentation();

        function addComplication(conceptName) {
            console.log('(MotherProgramEncounterDecision) Adding if not exists to preg complications: ' + conceptName);
            var pregnancyComplications = C.findValue(decisions, 'Pregnancy Complications');
            if (pregnancyComplications === undefined){
                pregnancyComplications = [];
                decisions.push({name: 'Pregnancy Complications', value: pregnancyComplications})
            }
            pregnancyComplications.push(conceptName);
        }

        function getObservationValueFromEntireEnrolment(conceptName) {
            return programEncounter.programEnrolment.getObservationValueFromEntireEnrolment(conceptName, programEncounter);
        }

        function observationExistsInEntireEnrolment(conceptName) {
            return programEncounter.programEnrolment.getObservationValueFromEntireEnrolment(conceptName, programEncounter);
        }


        function analyseHypertensiveRisks() {
            const systolic = getObservationValueFromEntireEnrolment('Systolic');
            const diastolic = getObservationValueFromEntireEnrolment('Diastolic');
            const urineAlbumin = getObservationValueFromEntireEnrolment('Urine Albumin');
            const obsHistory = getObservationValueFromEntireEnrolment('Obstetrics History');

            const mildPreEclempsiaUrineAlbuminValues = ['Trace', '+1', '+2'];
            const severePreEclempsiaUrineAlbuminValues = ['+3', '+4'];

            if (urineAlbumin === undefined)
                decisions.push(C.decision('Investigation Advice', 'Send patient to FRU immediately for Urine Albumin Test'));

            const isBloodPressureHigh = (systolic >= 140) || (diastolic >= 90); //can go in high risk category
            const urineAlbuminIsMild = C.contains(mildPreEclempsiaUrineAlbuminValues, urineAlbumin);
            const urineAlbuminIsSevere = C.contains(severePreEclempsiaUrineAlbuminValues, urineAlbumin);
            const obsHistoryOfPregnancyInducedHypertension = C.contains(obsHistory, 'Pregnancy Induced Hypertension');
            const hasConvulsions = getObservationValueFromEntireEnrolment('Convulsions'); //will be identified in hospital
            const isChronicHypertensive = observationExistsInEntireEnrolment('Chronic Hypertension');

            if (pregnancyPeriodInWeeks <= 20 && isBloodPressureHigh) {
                if (urineAlbumin === 'Absent') addComplication('Chronic Hypertension');
                if (urineAlbuminIsMild || urineAlbuminIsSevere) {
                    addComplication('Chronic Hypertension with Superimposed Pre-Eclampsia');
                }
            } else if (pregnancyPeriodInWeeks > 20 && !isChronicHypertensive) {
                if (!obsHistoryOfPregnancyInducedHypertension && isBloodPressureHigh){
                    addComplication('Pregnancy Induced Hypertension');
                    if (hasConvulsions && (urineAlbuminIsMild || urineAlbuminIsSevere))
                        addComplication('Eclampsia');
                    else if (!hasConvulsions && urineAlbuminIsMild) addComplication('Mild Pre-Eclampsia');
                    else if (!hasConvulsions && urineAlbuminIsSevere) addComplication('Severe Pre-Eclampsia');
                }
            }
        }

        function analyseAnemia() { //anm also does this test
            var hemoglobin = getObservationValueFromEntireEnrolment('Hb');
            if (hemoglobin === undefined) decisions.push({name: 'Investigation Advice', value: 'Send patient to FRU immediately for Hemoglobin Test'});
            else if (hemoglobin < 7) {
                decisions.push({name: 'Treatment Advice', value: "Severe Anemia. Refer to FRU for further checkup and possible transfusion"});
                addComplication('Severe Anemia');
            } else if (hemoglobin  >= 7 || hemoglobin <= 11){
                addComplication('Moderate Anemia');
                decisions.push({name: 'Treatment Advice', value: "Moderate Anemia. Start therapeutic dose of IFA"});
            } else if ( hemoglobin  > 11)
                decisions.push({name: 'Treatment Advice', value: "Hb normal. Proceed with Prophylactic treatment against anaemia"});
        }

        function manageVaginalBleeding() {
            var vaginalBleeding = getObservationValueFromEntireEnrolment('Vaginal Bleeding'); // provided this has been informed. during the delivery is difficult.
            if (vaginalBleeding !== undefined && pregnancyPeriodInWeeks > 20) decisions.push({name: 'Referral Advice', value: 'Send patient to FRU immediately'});
            else if (vaginalBleeding && pregnancyPeriodInWeeks <= 20) {
                decisions.push({name: 'Referral Advice', value: "Severe Anemia. Refer to FRU for test"});
                addComplication('Moderate Anemia');
            }
        }

        function analyseSexuallyTransmittedDisease() {
            var hivaids = getObservationValueFromEntireEnrolment('HIV/AIDS');
            if(hivaids === 'Positive') addComplication('HIV/AIDS Positive');

            var vdrl = getObservationValueFromEntireEnrolment('VDRL');
            if(vdrl === 'Positive') addComplication('VDRL Positive');
        }

        function analyseSickling() {
            var sickling = getObservationValueFromEntireEnrolment('Sickling Test');
            if(sickling) addComplication('Sickling Positive');
            var hbElectrophoresis = getObservationValueFromEntireEnrolment('Hb Electrophoresis');
            if(hbElectrophoresis) addComplication('Sickle Cell Disease SS');
        }

        function analyseHepatitisB() {
            var hepatitisB = getObservationValueFromEntireEnrolment('HbsAg');
            if(hepatitisB === 'Positive') addComplication('Hepatitis B Positive');
        }

        function analyseMalaria() {
            var paracheck = getObservationValueFromEntireEnrolment('Paracheck');
            if(paracheck === 'Positive for PF' || paracheck === 'Positive for PV' || paracheck === 'Positive for PF and PV')
            addComplication('Malaria');
        }

        function analyseFoetalPresentation() {
            var foetalPresentation = getObservationValueFromEntireEnrolment('Foetal presentation');
            if(C.contains(foetalPresentation, 'Cephalic') || C.contains(foetalPresentation, 'Breech')
                || C.contains(foetalPresentation, 'Transverse'))
            addComplication('Malpresentation');
        }

        return decisions;

    } else return [];


};



module.exports.getNextScheduledVisits = function (programEncounter, today) {
    return programDecision.getNextScheduledVisits(programEncounter.programEnrolment, today, programEncounter);
};