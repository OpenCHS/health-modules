var expect = require('chai').expect;
const assert = require('chai').assert;
var mother = require('../health_modules/mother/motherProgramEncounterDecision');
const ProgramEncounter = require("./Entities").ProgramEncounter;
const ProgramEnrolment = require("./Entities").ProgramEnrolment;
const C = require('../health_modules/common');

describe('High Risk Pregnancy Determination', function () {
    var enrolment;
    var programEncounter;
    var referenceDate;

    beforeEach(function () {
        referenceDate = new Date(2017, 6, 6);
        programEncounter = new ProgramEncounter("ANC", referenceDate);
        enrolment = new ProgramEnrolment('Mother', [programEncounter]);
        enrolment.setObservation('Last Menstrual Period', new Date(2017, 1, 10));
        programEncounter.programEnrolment = enrolment;
    });

    it('Check for mild pre-eclampsia ', function () {
        programEncounter.setObservation("Hb", 4).setObservation("Systolic", 150).setObservation("Diastolic", 90);
        programEncounter.setObservation("Urine Albumin", '+1');
        var decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
        var complicationValues = C.findValue(decisions, 'High Risk Conditions');
        expect(complicationValues.indexOf("Pregnancy Induced Hypertension")).is.not.equal(-1);
        expect(complicationValues.indexOf("Mild Pre-Eclampsia")).is.not.equal(-1);
    });

    it('Check for eclampsia ', function () {
        programEncounter.setObservation("Hb", 4).setObservation("Systolic", 150).setObservation("Diastolic", 90);
        programEncounter.setObservation("Convulsions", true);
        programEncounter.setObservation("Urine Albumin", '+1');
        var decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
        var complicationValues = C.findValue(decisions, 'High Risk Conditions');
        expect(complicationValues.indexOf("Pregnancy Induced Hypertension")).is.not.equal(-1);
        expect(complicationValues.indexOf("Eclampsia")).is.not.equal(-1);
    });

    it('Check for severe pre-eclampsia ', function () {
        programEncounter.setObservation("Hb", 4).setObservation("Systolic", 150).setObservation("Diastolic", 90);
        programEncounter.setObservation("Urine Albumin", '+3');
        var decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
        var complicationValues = C.findValue(decisions, 'High Risk Conditions');
        expect(complicationValues.indexOf("Pregnancy Induced Hypertension")).is.not.equal(-1);
        expect(complicationValues.indexOf("Severe Pre-Eclampsia")).is.not.equal(-1);
    });

    it('Check for Anemia based on Hb result', function () {
        programEncounter.setObservation("Hb", 4).setObservation("Systolic", 150).setObservation("Diastolic", 90);
        var decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
        var complicationValues = C.findValue(decisions, 'High Risk Conditions');
        expect(complicationValues.indexOf("Severe Anemia")).is.not.equal(-1);
    });

    it('no high risk condition', () => {
        var decisions = mother.getDecisions(programEncounter, new Date(2017, 2, 10)).encounterDecisions;
        var complicationValues = C.findValue(decisions, 'High Risk Conditions');
        expect(complicationValues).is.equal(null);
    });
});
