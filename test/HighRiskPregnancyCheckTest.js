const expect = require('chai').expect;
const moment = require('moment');
const assert = require('chai').assert;
const _ = require('lodash');
const motherEncounterDecision = require('../health_modules/mother/motherProgramEncounterDecision');
const motherEnrolmentDecision = require('../health_modules/mother/motherProgramEnrolmentDecision');
const ProgramEncounter = require("./Entities").ProgramEncounter;
const ProgramEnrolment = require("./Entities").ProgramEnrolment;
const C = require('../health_modules/common');
const concepts = require('./Concepts');

describe('High Risk Pregnancy Determination', () => {
    let enrolment, programEncounter, referenceDate, systolicConcept, diastolicConcept, hb, age, dob, hiv, vdrl, height,
        weight, sicklingTest, hbE, hbsAg, obstetricsHistory, paracheck;

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
        sicklingTest = concepts["Sickling Test"];
        hbE = concepts["Hb Electrophoresis"];
        hbsAg = concepts["HbsAg"];
        paracheck = concepts["Paracheck"];
        obstetricsHistory = concepts["Obstetrics History"];
        enrolment.setObservation('Last Menstrual Period', moment(referenceDate).subtract(20, "weeks").toDate());
    });

    describe("Less than 20 weeks of pregnancy", () => {

        beforeEach(() => {
            enrolment.setObservation('Last Menstrual Period', moment(referenceDate).subtract(20, "weeks").toDate());
        });

        describe("Ante Partum hemorrhage (APH)", () => {
            it("Shouldn't mark high risk if Pregnancy complaints are undefined", () => {
                enrolment.setObservation("Pregnancy Complaints", undefined);
                const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.not.exist;
            });

            it("Shouldn't mark high risk if Pregnancy complaints are empty", () => {
                enrolment.setObservation("Pregnancy Complaints", []);
                const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.not.exist;
            });

            it("Shouldn't mark high risk if vaginal bleeding is present", () => {
                enrolment.setObservation("Pregnancy Complaints", ["PV bleeding"]);
                const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.exist;
                expect(complications).to.be.an('array').that.includes('Miscarriage');
            });

        });

        describe('Chronic Hypertension', () => {

            it("Should not mark Chronic Hypertension as if BP is normal", () => {
                programEncounter.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                    .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.not.exist;
            });


            it("Should mark Chronic Hypertension as High Risk If Systolic is abnormal high", () => {
                programEncounter.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                    .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.exist;
                expect(complications).to.be.an('array').that.includes('Chronic Hypertension');
            });

            it("Should mark Chronic Hypertension as High Risk If Diastolic is abnormal high", () => {
                programEncounter.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                    .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.exist;
                expect(complications).to.be.an('array').that.includes('Chronic Hypertension');
            });

            it("Should mark Chronic Hypertension as High Risk If Diastolic and Systolic is abnormal high", () => {
                programEncounter.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                    .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
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
                    programEncounter.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1)
                        .setObservation(urineAlbumin.name, "Absent");

                });

                it('Should not mark superimposed pre-eclampsia and Hypertension with Absent Urine Albumin and normal BP', () => {
                    const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, 'High Risk Conditions');
                    expect(complications).to.be.null;
                });

                it('Should not mark superimposed pre-eclampsia and Hypertension with Absent Urine Albumin', () => {
                    programEncounter.setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                    const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, 'High Risk Conditions');
                    expect(complications).to.exist;
                    expect(complications).to.be.an('array').that.includes('Chronic Hypertension');
                    expect(complications).to.be.an('array').to.not.include('Superimposed Pre-Eclampsia');
                });

            });

            describe('Presence of Urine Albumin', () => {
                beforeEach(() => {
                    programEncounter.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);

                });

                afterEach(() => {
                    const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, 'High Risk Conditions');
                    expect(complications).to.exist;
                    expect(complications).to.be.an('array').that.includes('Chronic Hypertension');
                    expect(complications).to.be.an('array').that.includes('Superimposed Pre-Eclampsia');
                });

                it('Should mark superimposed pre-eclampsia with Trace Urine Albumin ', () => {
                    programEncounter.setObservation("Urine Albumin", 'Trace');
                });

                it('Should mark superimposed pre-eclampsia with +1 Urine Albumin ', () => {
                    programEncounter.setObservation("Urine Albumin", '+1');
                });

                it('Should mark superimposed pre-eclampsia with +2 Urine Albumin ', () => {
                    programEncounter.setObservation("Urine Albumin", '+2');
                });

                it('Should mark superimposed pre-eclampsia with +3 Urine Albumin ', () => {
                    programEncounter.setObservation("Urine Albumin", '+3');
                });

                it('Should mark superimposed pre-eclampsia with +4 Urine Albumin ', () => {
                    programEncounter.setObservation("Urine Albumin", '+4');
                });

            });
        });

    });

    describe("More than 20 weeks of pregnancy", () => {
        let lmp;
        beforeEach(() => {
            lmp = new Date(2017, 1, 10);
            enrolment.setObservation('Last Menstrual Period', lmp);
        });

        describe("Ante Partum hemorrhage (APH)", () => {

            it("Shouldn't mark high risk if Pregnancy complaints are undefined", () => {
                enrolment.setObservation("Pregnancy Complaints", undefined);
                const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.not.exist;
            });

            it("Shouldn't mark high risk if Pregnancy complaints are empty", () => {
                enrolment.setObservation("Pregnancy Complaints", []);
                const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.not.exist;
            });

            it("Should mark high risk if vaginal bleeding is present", () => {
                enrolment.setObservation("Pregnancy Complaints", ["PV bleeding"]);
                const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.exist;
                expect(complications).to.be.an('array').that.includes('Ante Partum hemorrhage (APH)');
            });

        });

        describe("Pregnancy Induced Hypertension", () => {
            it("Should not mark high risk for normal BP", () => {
                enrolment.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                    .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
                const complications = C.findValue(decisions, "High Risk Conditions");
                expect(complications).to.not.exist;
            });

            describe("Normal BP during the first 20 weeks", () => {
                let programEncounter1, programEncounter2, programEncounter3;
                beforeEach(() => {
                    referenceDate = new Date(2017, 6, 6);
                    programEncounter1 = new ProgramEncounter("ANC", moment(lmp).add(4, "weeks").toDate());
                    programEncounter2 = new ProgramEncounter("ANC", moment(lmp).add(13, "weeks").toDate());
                    programEncounter3 = new ProgramEncounter("ANC", moment(lmp).add(21, "weeks").toDate());
                    programEncounter1.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                    programEncounter2.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                    enrolment = new ProgramEnrolment('Mother', [programEncounter1, programEncounter2, programEncounter3]);
                    enrolment.setObservation('Last Menstrual Period', lmp);
                    enrolment.setObservation('High Risk Conditions', []);
                    programEncounter1.programEnrolment = enrolment;
                    programEncounter2.programEnrolment = enrolment;
                    programEncounter3.programEnrolment = enrolment;
                });

                it("Should mark high risk for high Systolic BP given normal BP before 20 Weeks", () => {
                    programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                    const decisions = motherEncounterDecision.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, "High Risk Conditions");
                    expect(complications).to.exist;
                    expect(complications).to.be.an('array').that.includes('Pregnancy Induced Hypertension');
                });

                it("Should mark high risk for high Diastolic BP given normal BP before 20 Weeks", () => {
                    programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                    const decisions = motherEncounterDecision.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, "High Risk Conditions");
                    expect(complications).to.exist;
                    expect(complications).to.be.an('array').that.includes('Pregnancy Induced Hypertension');
                });

                it("Should mark high risk for high Diastolic and Diastolic BP given normal before 20 Weeks", () => {
                    programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                    const decisions = motherEncounterDecision.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, "High Risk Conditions");
                    expect(complications).to.exist;
                    expect(complications).to.be.an('array').that.includes('Pregnancy Induced Hypertension');
                });
            });


            describe("High BP during the first 20 weeks", () => {
                let programEncounter1, programEncounter2, programEncounter3;
                beforeEach(() => {
                    referenceDate = new Date(2017, 6, 6);
                    programEncounter1 = new ProgramEncounter("ANC", moment(lmp).add(4, "weeks").toDate());
                    programEncounter2 = new ProgramEncounter("ANC", moment(lmp).add(13, "weeks").toDate());
                    programEncounter3 = new ProgramEncounter("ANC", moment(lmp).add(21, "weeks").toDate());
                    programEncounter1.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                    programEncounter2.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                    enrolment = new ProgramEnrolment('Mother', [programEncounter1, programEncounter2, programEncounter3]);
                    enrolment.setObservation('High Risk Conditions', ["Chronic Hypertension"]);
                    enrolment.setObservation('Last Menstrual Period', lmp);
                    programEncounter1.programEnrolment = enrolment;
                    programEncounter2.programEnrolment = enrolment;
                    programEncounter3.programEnrolment = enrolment;
                });

                it("Should mark high risk for high Systolic BP given normal before 20 Weeks", () => {
                    programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal - 1);
                    const decisions = motherEncounterDecision.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, "High Risk Conditions");
                    expect(complications).to.not.exist;
                });

                it("Should mark high risk for high Diastolic BP given normal before 20 Weeks", () => {
                    programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal - 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                    const decisions = motherEncounterDecision.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, "High Risk Conditions");
                    expect(complications).to.not.exist;
                });

                it("Should mark high risk for high Diastolic and Diastolic BP given normal before 20 Weeks", () => {
                    programEncounter3.setObservation(systolicConcept.name, systolicConcept.highNormal + 1)
                        .setObservation(diastolicConcept.name, diastolicConcept.highNormal + 1);
                    const decisions = motherEncounterDecision.getDecisions(programEncounter3, referenceDate).encounterDecisions;
                    const complications = C.findValue(decisions, "High Risk Conditions");
                    expect(complications).to.not.exist;
                });
            });


        });
    });


    describe("Anemia", () => {
        it("Shouldn't have Anemia if hb is normal", () => {
            const range = hb.range.Female.find((ageRange) => (age >= ageRange.ageStart && age <= ageRange.ageEnd && ageRange.ageUnit === "years"));
            enrolment.setObservation(hb.name, range.lowNormal + 1);
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should have Moderate Anemia if hb is moderately below normal", () => {
            const range = hb.range.Female.find((ageRange) => (age >= ageRange.ageStart && age <= ageRange.ageEnd && ageRange.ageUnit === "years"));
            enrolment.setObservation(hb.name, range.lowAbsolute + 1);
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Moderate Anemia');
        });

        it("Should have Severe Anemia if hb is serverly below normal", () => {
            const range = hb.range.Female.find((ageRange) => (age >= ageRange.ageStart && age <= ageRange.ageEnd && ageRange.ageUnit === "years"));
            enrolment.setObservation(hb.name, range.lowAbsolute - 1);
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Severe Anemia');
        });

    });

    describe("HIV/AIDS", () => {
        it("Shouldn't mark high risk if HIV/AIDS negative", () => {
            enrolment.setObservation(hiv.name, 'Negative');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should mark high risk if HIV/AIDS Postive", () => {
            enrolment.setObservation(hiv.name, 'Positive');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('HIV/AIDS Positive');
        });
    });


    describe("VDRL", () => {
        it("Shouldn't mark high risk if VDRL negative", () => {
            enrolment.setObservation(vdrl.name, 'Negative');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should mark high risk if VDRL Postive", () => {
            enrolment.setObservation(vdrl.name, 'Positive');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('VDRL Positive');
        });
    });

    describe("Short Stature", () => {
        it("Shouldn't mark high risk if height is not specified", () => {
            const decisions = motherEnrolmentDecision.getDecisions(enrolment, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.be.empty;
        });

        it("Shouldn't mark high risk if height is above 145cms", () => {
            enrolment.setObservation(height.name, 151);
            const decisions = motherEnrolmentDecision.getDecisions(enrolment, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.be.empty;
        });

        it("Should mark high risk if height is equal to 145cms", () => {
            enrolment.setObservation(height.name, 145);
            const decisions = motherEnrolmentDecision.getDecisions(enrolment, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Short Stature');
        });

        it("Should mark high risk if height is less than 145cms", () => {
            enrolment.setObservation(height.name, 100);
            const decisions = motherEnrolmentDecision.getDecisions(enrolment, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Short Stature');
        });
    });

    describe("Weight Issues", () => {
        it("Shouldn't mark high risk if weight is not specified", () => {
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Shouldn't mark high risk if weight is above 35Kgs", () => {
            enrolment.setObservation(weight.name, 36);
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should mark high risk if weight is equal to 35Kgs", () => {
            enrolment.setObservation(weight.name, 35);
            const decisions = motherEnrolmentDecision.getDecisions(enrolment, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Underweight');
        });

        it("Should mark high risk if weight is less than 35Kgs", () => {
            enrolment.setObservation(weight.name, 31);
            const decisions = motherEnrolmentDecision.getDecisions(enrolment, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Underweight');
        });
    });

    describe("Under/Old Age Pregnancy", () => {
        const setDOBTo = (age) => {
            referenceDate = new Date(2017, 6, 6);
            dob = moment(referenceDate).add(age, 'years').toDate();
            programEncounter = new ProgramEncounter("ANC", referenceDate);
            enrolment = new ProgramEnrolment('Mother', [programEncounter], dob);
            programEncounter.programEnrolment = enrolment;
            enrolment.setObservation('Last Menstrual Period', moment(referenceDate).subtract(20, "weeks").toDate());
        };

        it("Shouldn't mark high risk if age is 18", () => {
            setDOBTo(18);
            const decisions = motherEnrolmentDecision.getDecisions(enrolment, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.be.empty;
        });

        it("Shouldn't mark high risk if age is equal to 30", () => {
            setDOBTo(30);
            const decisions = motherEnrolmentDecision.getDecisions(enrolment, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.be.empty;
        });

        it("Should mark high risk if age is less than 18", () => {
            setDOBTo(15);
            const decisions = motherEnrolmentDecision.getDecisions(enrolment, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Under age pregnancy');
        });

        it("Should mark high risk if age is more than 30", () => {
            setDOBTo(32);
            const decisions = motherEnrolmentDecision.getDecisions(enrolment, referenceDate).enrolmentDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Old age pregnancy');
        });
    });

    describe("Sickling Positive", () => {
        it("Shouldn't mark high risk if Sickling test negative", () => {
            enrolment.setObservation(sicklingTest.name, 'Negative');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should mark high risk if Sickling Test Positive", () => {
            enrolment.setObservation(sicklingTest.name, 'Positive');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Sickling Positive');
        });
    });

    describe("Sickle Cell Disease", () => {
        it("Shouldn't mark high risk if Hb Electrophoresis AA", () => {
            enrolment.setObservation(hbE.name, 'AA');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Shouldn't mark high risk if Hb Electrophoresis AS", () => {
            enrolment.setObservation(hbE.name, 'AS');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should mark high risk if Hb Electrophoresis SS", () => {
            enrolment.setObservation(hbE.name, 'SS');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Sickle Cell Disease SS');
        });
    });


    describe("Hepatitis B", () => {
        it("Shouldn't mark high risk if HbsAg Negative", () => {
            enrolment.setObservation(hbsAg.name, 'Negative');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.not.exist;
        });

        it("Should mark high risk if HbsAg Positive", () => {
            enrolment.setObservation(hbsAg.name, 'Positive');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Hepatitis B Positive');
        });
    });

    describe("Obstetrics History", () => {
        it("Should mark high risk if Intrauterine Growth Retardation in Obstetrics History", () => {
            enrolment.setObservation(obstetricsHistory.name, 'Intrauterine Growth Retardation');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Intrauterine Growth Retardation');
        });

        it("Should mark high risk if Previous Still Birth in Obstetrics History", () => {
            enrolment.setObservation(obstetricsHistory.name, 'Still birth');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Previous still birth');
        });

        it("Should mark high risk if Intrauterine death in Obstetrics History", () => {
            enrolment.setObservation(obstetricsHistory.name, 'Intrauterine Death');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Previous Intrauterine Death');
        });

        it("Should mark high risk if Retained Placenta in Obstetrics History", () => {
            enrolment.setObservation(obstetricsHistory.name, 'Retained Placenta');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complicationValues = C.findValue(decisions, 'High Risk Conditions');
            expect(complicationValues).to.exist;
            expect(complicationValues).to.be.an('array').that.includes('Previous Retained Placenta');
        });
    });

    describe('Malaria', () => {
        it("Shouldn't mark high risk if Paracheck negative", () => {
            enrolment.setObservation(paracheck.name, 'Negative');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complications = C.findValue(decisions, 'High Risk Conditions');
            expect(complications).to.not.exist;
        });

        it('Should mark high risk and malaria positive if Paracheck PV', () => {
            enrolment.setObservation(paracheck.name, 'Positive for PV');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complications = C.findValue(decisions, 'High Risk Conditions');
            expect(complications).to.exist;
            expect(complications).to.be.an('array').that.includes('Malaria');
        });

        it('Should mark high risk and malaria positive if Paracheck PF', () => {
            enrolment.setObservation(paracheck.name, 'Positive for PF');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complications = C.findValue(decisions, 'High Risk Conditions');
            expect(complications).to.exist;
            expect(complications).to.be.an('array').that.includes('Malaria');
        });

        it('Should mark high risk and malaria positive if Paracheck PF and PV', () => {
            enrolment.setObservation(paracheck.name, 'Positive for PF and PV');
            const decisions = motherEncounterDecision.getDecisions(programEncounter, referenceDate).encounterDecisions;
            const complications = C.findValue(decisions, 'High Risk Conditions');
            expect(complications).to.exist;
            expect(complications).to.be.an('array').that.includes('Malaria');
        });

    });

    // describe("")

});
