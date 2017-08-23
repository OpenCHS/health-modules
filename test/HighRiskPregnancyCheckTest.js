var expect = require('chai').expect;
const assert = require('chai').assert;
const _ = require('lodash');
var mother = require('../health_modules/mother/motherProgramEncounterDecision');
const ProgramEncounter = require("./Entities").ProgramEncounter;
const ProgramEnrolment = require("./Entities").ProgramEnrolment;
const C = require('../health_modules/common');
const concepts = require('./Concepts');

describe('High Risk Pregnancy Determination', function () {
    let enrolment, programEncounter, referenceDate;

    beforeEach(function () {
        referenceDate = new Date(2017, 6, 6);
        programEncounter = new ProgramEncounter("ANC", referenceDate);
        enrolment = new ProgramEnrolment('Mother', [programEncounter]);
        enrolment.setObservation('Last Menstrual Period', new Date(2017, 1, 10));
        programEncounter.programEnrolment = enrolment;
    });


    it("Should mark Chronic Hypertension as High Risk If Systolic is abnormal high and under 20 weeks", () => {
        const systolicConcept = concepts['Systolic'];
        const diastolicConcept = concepts['Diastolic'];
        enrolment.setObservation('Last Menstrual Period', new Date(2017, 5, 10));
        enrolment.setObservation(systolicConcept.name, systolicConcept.highNormal + 1);
        enrolment.setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
        let decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
        expect(_.isEmpty(C.findValue(decisions, "High Risk Conditions"))).to.be.false;
    });

    it("Should mark Chronic Hypertension as High Risk If Diastolic is abnormal high and under 20 weeks", () => {
        const systolicConcept = concepts['Systolic'];
        const diastolicConcept = concepts['Diastolic'];
        enrolment.setObservation('Last Menstrual Period', new Date(2017, 5, 10));
        enrolment.setObservation(systolicConcept.name, systolicConcept.highNormal - 1);
        enrolment.setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
        let decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
        expect(_.isEmpty(C.findValue(decisions, "High Risk Conditions"))).to.be.false;
    });

    it("Should mark Chronic Hypertension as High Risk If Diastolic and Systolic is abnormal high and under 20 weeks", () => {
        const systolicConcept = concepts['Systolic'];
        const diastolicConcept = concepts['Diastolic'];
        enrolment.setObservation('Last Menstrual Period', new Date(2017, 5, 10));
        enrolment.setObservation(systolicConcept.name, systolicConcept.highNormal + 1);
        enrolment.setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
        let decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
        expect(_.isEmpty(C.findValue(decisions, "High Risk Conditions"))).to.be.false;
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
