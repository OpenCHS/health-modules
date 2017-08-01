var expect = require('chai').expect;
const assert = require('chai').assert;
var mother = require('../health_modules/mother/motherProgramEncounterDecision');
const ProgramEncounter = require("./Entities").ProgramEncounter;
const ProgramEnrolment = require("./Entities").ProgramEnrolment;
const C = require('../health_modules/common');

describe('Make Decision', function () {

    var enrolment;
    var programEncounter;
    var referenceDate;

    beforeEach(function () {
        programEncounter = new ProgramEncounter();
        referenceDate = new Date(2017, 6, 6);
        enrolment = new ProgramEnrolment('Mother', [programEncounter]);
        enrolment.setObservation('Last Menstrual Period', new Date(2017, 1, 10));
        programEncounter.setObservation("Hb", 4).setObservation("Systolic", 150).setObservation("Diastolic", 90);
        programEncounter.programEnrolment = enrolment;
    });

    it('Check for mild pre-eclampsia ', function () {
        programEncounter.setObservation("Urine Albumen", '+1');
        var decisions = mother.getDecisions(programEncounter, referenceDate);
        var complicationValues = C.findValue(decisions,'High Risk Conditions');
        expect(complicationValues.indexOf("Pregnancy Induced Hypertension")).is.not.equal(-1);
        expect(complicationValues.indexOf("Mild Pre-Eclampsia")).is.not.equal(-1);
    });

    it('Check for eclampsia ', function () {
        programEncounter.setObservation("Convulsions", true);
        programEncounter.setObservation("Urine Albumen", '+1');
        var decisions = mother.getDecisions(programEncounter, referenceDate);
        var complicationValues = C.findValue(decisions,'High Risk Conditions');
        expect(complicationValues.indexOf("Pregnancy Induced Hypertension")).is.not.equal(-1);
        expect(complicationValues.indexOf("Eclampsia")).is.not.equal(-1);
    });

    it('Check for severe pre-eclampsia ', function () {
        programEncounter.setObservation("Urine Albumen", '+3');
        var decisions = mother.getDecisions(programEncounter, referenceDate);
        var complicationValues = C.findValue(decisions,'High Risk Conditions');
        expect(complicationValues.indexOf("Pregnancy Induced Hypertension")).is.not.equal(-1);
        expect(complicationValues.indexOf("Severe Pre-Eclampsia")).is.not.equal(-1);
    });

    it('Check for Anemia based on Hb result', function () {
        var decisions = mother.getDecisions(programEncounter, referenceDate);
        var complicationValues = C.findValue(decisions, 'High Risk Conditions');
        expect(complicationValues.indexOf("Severe Anemia")).is.not.equal(-1);
    });
});
