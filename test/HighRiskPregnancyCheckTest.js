const expect = require('chai').expect;
const moment = require('moment');
const assert = require('chai').assert;
const _ = require('lodash');
const mother = require('../health_modules/mother/motherProgramEncounterDecision');
const ProgramEncounter = require("./Entities").ProgramEncounter;
const ProgramEnrolment = require("./Entities").ProgramEnrolment;
const C = require('../health_modules/common');
const concepts = require('./Concepts');

describe('High Risk Pregnancy Determination', () => {
    let enrolment, programEncounter, referenceDate, systolicConcept, diastolicConcept;

    beforeEach(() => {
        referenceDate = new Date(2017, 6, 6);
        programEncounter = new ProgramEncounter("ANC", referenceDate);
        enrolment = new ProgramEnrolment('Mother', [programEncounter]);
        programEncounter.programEnrolment = enrolment;
        systolicConcept = concepts['Systolic'];
        diastolicConcept = concepts['Diastolic'];
    });

    describe("Less than 20 weeks of pregnancy", () => {

        beforeEach(() => {
            enrolment.setObservation('Last Menstrual Period', moment(referenceDate).subtract(20, "weeks"));
        });

        describe('Chronic Hypertension', () => {

            it("Should not mark Chronic Hypertension as if BP is normal", () => {
                enrolment.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                    .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.not.exist;
            });


            it("Should mark Chronic Hypertension as High Risk If Systolic is abnormal high", () => {
                enrolment.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                    .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.exist;
                expect(complications).to.be.an('array').that.includes('Chronic Hypertension');
            });

            it("Should mark Chronic Hypertension as High Risk If Diastolic is abnormal high", () => {
                enrolment.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                    .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.exist;
                expect(complications).to.be.an('array').that.includes('Chronic Hypertension');
            });

            it("Should mark Chronic Hypertension as High Risk If Diastolic and Systolic is abnormal high", () => {
                enrolment.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                    .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.exist;
                expect(complications).to.be.an('array').that.includes('Chronic Hypertension');
            });
        });

        describe("Chronic Hypertension with Superimposed Pre-Eclampsia", () => {
            let urineAlbumin;

            beforeEach(() => {
                urineAlbumin = concepts['Urine Albumin'];
            });

            describe('Absence of Urine Albumin', () => {
                beforeEach(() => {
                    enrolment.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1)
                        .setObservation(urineAlbumin.name, "Absent");

                });

                it('Should not mark superimposed pre-eclampsia and Hypertension with Absent Urine Albumin and normal BP', () => {
                    const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, 'High Risk Conditions');
                    expect(complications).to.be.null;
                });

                it('Should not mark superimposed pre-eclampsia and Hypertension with Absent Urine Albumin', () => {
                    enrolment.setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                    const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, 'High Risk Conditions');
                    expect(complications).to.exist;
                    expect(complications).to.be.an('array').to.not.include('Chronic Hypertension with Superimposed Pre-Eclampsia');
                });

            });

            describe('Presence of Urine Albumin', () => {
                beforeEach(() => {
                    enrolment.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);

                });

                afterEach(() => {
                    const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, 'High Risk Conditions');
                    expect(complications).to.exist;
                    expect(complications).to.be.an('array').that.includes('Chronic Hypertension with Superimposed Pre-Eclampsia');
                });

                it('Should mark superimposed pre-eclampsia with Trace Urine Albumin ', () => {
                    enrolment.setObservation("Urine Albumin", 'Trace');
                });

                it('Should mark superimposed pre-eclampsia with +1 Urine Albumin ', () => {
                    enrolment.setObservation("Urine Albumin", '+1');
                });

                it('Should mark superimposed pre-eclampsia with +2 Urine Albumin ', () => {
                    enrolment.setObservation("Urine Albumin", '+2');
                });

                it('Should mark superimposed pre-eclampsia with +3 Urine Albumin ', () => {
                    enrolment.setObservation("Urine Albumin", '+3');
                });

                it('Should mark superimposed pre-eclampsia with +4 Urine Albumin ', () => {
                    enrolment.setObservation("Urine Albumin", '+4');
                });

            });
        });

    });

    describe("More than 20 weeks of pregnancy", () => {
        describe("Pregnancy induced Hypertension", () => {
            beforeEach(() => {
                enrolment.setObservation('Last Menstrual Period', new Date(2017, 1, 10));
            });

            describe("Pregnancy Induced Hypertension", () => {
                it("Should not mark high risk for normal BP", () => {
                    enrolment.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                    const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, "High Risk Conditions");
                    expect(complications).to.not.exist;
                });

                describe("Normal BP during the first 20 weeks", () => {
                    let programEncounter1, programEncounter2, programEncounter3;
                    beforeEach(() => {
                        referenceDate = new Date(2017, 6, 6);
                        programEncounter1 = new ProgramEncounter("ANC 1", moment(referenceDate).subtract(19, "weeks"));
                        programEncounter2 = new ProgramEncounter("ANC 2", moment(referenceDate).subtract(10, "weeks"));
                        programEncounter3 = new ProgramEncounter("ANC 3", referenceDate);
                        programEncounter1.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                            .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                        programEncounter2.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                            .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                        enrolment = new ProgramEnrolment('Mother', [programEncounter1, programEncounter2, programEncounter3]);
                        programEncounter1.programEnrolment = enrolment;
                        programEncounter2.programEnrolment = enrolment;
                        programEncounter3.programEnrolment = enrolment;
                    });

                    it("Should mark high risk for high Systolic BP given normal before 20 Weeks", () => {
                        programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                            .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                        const decisions = mother.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                        const complications = C.findValue(decisions, "High Risk Conditions");
                        expect(complications).to.exist;
                        expect(complications).to.be.an('array').that.includes('Pregnancy Induced Hypertension');
                    });

                    it("Should mark high risk for high Diastolic BP given normal before 20 Weeks", () => {
                        programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                            .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                        const decisions = mother.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                        const complications = C.findValue(decisions, "High Risk Conditions");
                        expect(complications).to.exist;
                        expect(complications).to.be.an('array').that.includes('Pregnancy Induced Hypertension');
                    });

                    it("Should mark high risk for high Diastolic and Diastolic BP given normal before 20 Weeks", () => {
                        programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                            .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                        const decisions = mother.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                        const complications = C.findValue(decisions, "High Risk Conditions");
                        expect(complications).to.exist;
                        expect(complications).to.be.an('array').that.includes('Pregnancy Induced Hypertension');
                    });
                });


                describe("High BP during the first 20 weeks", () => {
                    let programEncounter1, programEncounter2, programEncounter3;
                    beforeEach(() => {
                        referenceDate = new Date(2017, 6, 6);
                        programEncounter1 = new ProgramEncounter("ANC 1", moment(referenceDate).subtract(19, "weeks"));
                        programEncounter2 = new ProgramEncounter("ANC 2", moment(referenceDate).subtract(10, "weeks"));
                        programEncounter3 = new ProgramEncounter("ANC 3", referenceDate);
                        programEncounter1.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                            .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                        programEncounter2.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                            .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                        enrolment = new ProgramEnrolment('Mother', [programEncounter1, programEncounter2, programEncounter3]);
                        programEncounter1.programEnrolment = enrolment;
                        programEncounter2.programEnrolment = enrolment;
                        programEncounter3.programEnrolment = enrolment;
                    });

                    it("Should mark high risk for high Systolic BP given normal before 20 Weeks", () => {
                        programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                            .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                        const decisions = mother.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                        const complications = C.findValue(decisions, "High Risk Conditions");
                        expect(complications).to.exist;
                        expect(complications).to.be.an('array').that.does.not.include('Pregnancy Induced Hypertension');
                    });

                    it("Should mark high risk for high Diastolic BP given normal before 20 Weeks", () => {
                        programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                            .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                        const decisions = mother.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                        const complications = C.findValue(decisions, "High Risk Conditions");
                        expect(complications).to.exist;
                        expect(complications).to.be.an('array').that.does.not.include('Pregnancy Induced Hypertension');
                    });

                    it("Should mark high risk for high Diastolic and Diastolic BP given normal before 20 Weeks", () => {
                        programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                            .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                        const decisions = mother.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                        const complications = C.findValue(decisions, "High Risk Conditions");
                        expect(complications).to.exist;
                        expect(complications).to.be.an('array').that.does.not.include('Pregnancy Induced Hypertension');
                    });
                });


            });
        });


    });

    it('Check for Anemia based on Hb result', () => {
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
