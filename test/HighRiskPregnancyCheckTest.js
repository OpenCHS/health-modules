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
    let enrolment, programEncounter, referenceDate, systolicConcept, diastolicConcept, hb, age, dob, hiv, vdrl, height,
        weight;

    beforeEach(() => {
        referenceDate = new Date(2017, 6, 6);
        dob = new Date(1990, 6, 6);
        age = moment(referenceDate).diff(dob, 'years');
        programEncounter = new ProgramEncounter("ANC", referenceDate);
        enrolment = new ProgramEnrolment('Mother', [programEncounter], dob);
        programEncounter.programEnrolment = enrolment;
        systolicConcept = concepts['Systolic'];
        diastolicConcept = concepts['Diastolic'];
        hb = concepts['Hb'];
        hiv = concepts['HIV/AIDS'];
        vdrl = concepts['VDRL'];
        height = concepts["Height"];
        weight = concepts["Weight"];
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

        describe("Superimposed Pre-Eclampsia", () => {
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
                    expect(complications).to.be.an('array').that.includes('Chronic Hypertension');
                    expect(complications).to.be.an('array').to.not.include('Superimposed Pre-Eclampsia');
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
                    expect(complications).to.be.an('array').that.includes('Chronic Hypertension');
                    expect(complications).to.be.an('array').that.includes('Superimposed Pre-Eclampsia');
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


    describe("Anemia", () => {
        it("Shouldn't have Anemia if hb is normal", () => {
            const range = hb.range.Female.find((ageRange) => (age >= ageRange.ageStart && age <= ageRange.ageEnd && ageRange.ageUnit === "years"));
            enrolment.setObservation(hb.name, range.lowNormal + 1);
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should have Moderate Anemia if hb is moderately below normal", () => {
            const range = hb.range.Female.find((ageRange) => (age >= ageRange.ageStart && age <= ageRange.ageEnd && ageRange.ageUnit === "years"));
            enrolment.setObservation(hb.name, range.lowAbsolute + 1);
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Moderate Anemia');
        });

        it("Should have Severe Anemia if hb is serverly below normal", () => {
            const range = hb.range.Female.find((ageRange) => (age >= ageRange.ageStart && age <= ageRange.ageEnd && ageRange.ageUnit === "years"));
            enrolment.setObservation(hb.name, range.lowAbsolute - 1);
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Severe Anemia');
        });

    });

    describe("HIV/AIDS", () => {
        it("Shouldn't mark high risk if HIV/AIDS negative", () => {
            enrolment.setObservation(hiv.name, 'Negative');
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should mark high risk if HIV/AIDS Postive", () => {
            enrolment.setObservation(hiv.name, 'Positive');
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('HIV/AIDS Positive');
        });
    });


    describe("VDRL", () => {
        it("Shouldn't mark high risk if VDRL negative", () => {
            enrolment.setObservation(vdrl.name, 'Negative');
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should mark high risk if VDRL Postive", () => {
            enrolment.setObservation(vdrl.name, 'Positive');
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('VDRL Positive');
        });
    });

    describe("Short Stature", () => {
        it("Shouldn't mark high risk if height is not specified", () => {
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Shouldn't mark high risk if height is above 145cms", () => {
            enrolment.setObservation(height.name, 151);
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should mark high risk if height is equal to 145cms", () => {
            enrolment.setObservation(height.name, 145);
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Short Stature');
        });

        it("Should mark high risk if height is less than 145cms", () => {
            enrolment.setObservation(height.name, 100);
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Short Stature');
        });
    });

    describe("Weight Issues", () => {
        it("Shouldn't mark high risk if weight is not specified", () => {
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Shouldn't mark high risk if weight is above 35Kgs", () => {
            enrolment.setObservation(weight.name, 36);
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should mark high risk if height is equal to 35Kgs", () => {
            enrolment.setObservation(weight.name, 35);
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Underweight');
        });

        it("Should mark high risk if height is less than 35Kgs", () => {
            enrolment.setObservation(weight.name, 31);
            const decisions = mother.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Underweight');
        });
    });
});
