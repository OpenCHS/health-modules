var expect = require('chai').expect;
var decision = require('../deployables/encounterDecision');
var Encounter = require('./Encounter');

describe('Make Decision', function () {
    it('Regression for all diseases, to ensure there are no exceptions and error messages', function () {
        Object.keys(decision.treatmentByComplaintAndCode).forEach(function (complaint) {
            decision.weightRangesToCode.forEach(function (weightRangeToCode) {
                ["Male", "Female"].forEach(function (gender) {
                    var encounter = new Encounter();

                    encounter.setObservation("Complaint", [complaint]);
                    encounter.setObservation("Weight", weightRangeToCode.start);
                    encounter.setGender(gender);
                    encounter.setAge(10);
                    console.log("##### {complaint}, {weightRangeToCode.start}, {gender} ######".replace("{complaint}", complaint).replace("{weightRangeToCode.start}", weightRangeToCode.start).replace("{gender}", gender));
                    if (decision.validate(encounter).success) {
                        const decisions = decision.getDecisions(encounter);
                        expect(decisions.length).to.equal(1);
                        expect(decisions[0].value.includes("undefined")).to.equal(false, decisions[0].value);
                    }
                });
            });
        });
    });

    it('Validate', function () {
        var complaintConceptName = "Complaint";
        var validationResult = decision.validate(new Encounter().setObservation(complaintConceptName, ["Pregnancy"]).setObservation("Weight", 40).setGender("Male").setAge(25))[0];
        expect(validationResult.success).to.equal(false, validationResult.message);

        validationResult = decision.validate(new Encounter().setObservation(complaintConceptName, ["Pregnancy"]).setAge(5).setGender("Female").setObservation("Weight", 40))[0];
        expect(validationResult.success).to.equal(false, validationResult.message);

        validationResult = decision.validate(new Encounter().setObservation(complaintConceptName, ["Pregnancy"]).setAge(3).setGender("Female").setObservation("Weight", 40))[0];
        expect(validationResult.success).to.equal(false, validationResult.message);

        validationResult = decision.validate(new Encounter().setObservation(complaintConceptName, ["Pregnancy"]).setAge(12).setGender("Female").setObservation("Weight", 40))[0];
        expect(validationResult.success).to.equal(true, validationResult.message);

        validationResult = decision.validate(new Encounter().setObservation(complaintConceptName, ["Chloroquine Resistant Malaria"]).setObservation("Weight", 3).setGender("Male"))[0];
        expect(validationResult.success).to.equal(false, validationResult.message);
    });

    it('Complaint which allows for prescription', function () {
        var decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Cold"]).setGender("Male").setAge(25).setObservation("Weight", 40));
        expect(decisions[0].value).to.not.equal(undefined);
        expect(decisions[0].alert).to.equal(undefined);
    });

    it('Do not give any medicine for chloroquin resistant malaria to women between 16-40', function () {
        var decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Chloroquine Resistant Malaria"]).setGender("Female").setAge(25).setObservation("Weight", 40));
        expect(decisions[0].value).to.equal("");
        expect(decisions[0].alert).to.not.equal(undefined);
    });

    it('Provide day wise instructions when specified for days separately', function () {
        var decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Fever"]).setObservation("Paracheck", ["Positive for PF"]).setGender("Male").setAge(25).setObservation("Weight", 40));
        var chloroquinCount = (decisions[0].value.match(/क्लोरोक्विन/g) || []).length;
        expect(chloroquinCount).to.equal(3, decisions[0].value);
        var pcmCount = (decisions[0].value.match(/पॅरासिटामॉल/g) || []).length;
        expect(pcmCount).to.equal(3, decisions[0].value);
    });

    it('Do not provide day wise instructions when not specified for days separately', function () {
        var decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Cough"]).setGender("Male").setAge(25).setObservation("Weight", 40));
        var medicineCount = (decisions[0].value.match(/सेप्ट्रान/g) || []).length;
        expect(medicineCount).to.equal(1, decisions[0].value);
        expect((decisions[0].value.match(/पहिल्या दिवशी/g) || []).length).to.equal(0, decisions[0].value);
    });

    it('Print special instruction', function () {
        var decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Ring Worm"]).setGender("Male").setAge(25).setObservation("Weight", 40));
        var count = (decisions[0].value.match(/गजकर्णाच्या जागेवर लावण्यास सांगावे/g) || []).length;
        expect(count).to.equal(1, decisions[0].value);
        expect((decisions[0].value.match(/पहिल्या दिवशी/g) || []).length).to.equal(0, decisions[0].value);
    });

    it('In cough do not give Septran to potentially pregnant women', function () {
        var decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Cough"]).setGender("Male").setAge(25).setObservation("Weight", 40));
        expect((decisions[0].value.match(/सिफ्रान/g) || []).length).to.equal(0, decisions[0].value);
        expect((decisions[0].value.match(/सेप्ट्रान/g) || []).length).to.equal(1, decisions[0].value);

        decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Cough"]).setGender("Female").setAge(25).setObservation("Weight", 40));
        expect((decisions[0].value.match(/सिफ्रान/g) || []).length).to.equal(1, decisions[0].value);
        expect((decisions[0].value.match(/सेप्ट्रान/g) || []).length).to.equal(0, decisions[0].value);

        decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Cough"]).setGender("Female").setAge(45).setObservation("Weight", 40));
        expect((decisions[0].value.match(/सिफ्रान/g) || []).length).to.equal(0, decisions[0].value);
        expect((decisions[0].value.match(/सेप्ट्रान/g) || []).length).to.equal(1, decisions[0].value);

        decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Boils"]).setGender("Female").setAge(25).setObservation("Weight", 40));
        expect((decisions[0].value.match(/सिफ्रान/g) || []).length).to.equal(1, decisions[0].value);
        expect((decisions[0].value.match(/सेप्ट्रान/g) || []).length).to.equal(0, decisions[0].value);

        decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Wound"]).setGender("Female").setAge(25).setObservation("Weight", 40));
        expect((decisions[0].value.match(/सिफ्रान/g) || []).length).to.equal(1, decisions[0].value);
        expect((decisions[0].value.match(/सेप्ट्रान/g) || []).length).to.equal(0, decisions[0].value);
    });

    it('Before food and after food instruction', function () {
        var decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Cold"]).setGender("Male").setAge(25).setObservation("Weight", 40));
        expect((decisions[0].value.match(/जेवणाआधी/g) || []).length).to.equal(0, decisions[0].value);

        decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Acidity"]).setGender("Male").setAge(25).setObservation("Weight", 40));
        expect((decisions[0].value.match(/जेवणाआधी/g) || []).length).to.equal(1, decisions[0].value);
    });

    it('Multiple complaints without same medicines', function () {
        const decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Cold", "Body Ache"]).setGender("Male").setAge(25).setObservation("Weight", 40));
        const completeValue = decisions[0].value + decisions[1].value;
        expect((completeValue.match(/सेट्रीझीन/g) || []).length).to.equal(1, completeValue);
        expect((completeValue.match(/पॅरासिटामॉल/g) || []).length).to.equal(1, completeValue);
    });

    it('Multiple complaints with overlapping medicines', function () {
        var decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Cold", "Fever", "Body Ache"]).setGender("Male").setAge(25).setObservation("Weight", 40));
        var completeValue = decisions[0].value + decisions[1].value + decisions[2].value;
        expect((completeValue.match(/सेट्रीझीन/g) || []).length).to.equal(1, completeValue);
        expect((completeValue.match(/पॅरासिटामॉल/g) || []).length).to.equal(1, completeValue);
    });

    it('Multiple complaints with overlapping medicines and different order of medicines', function () {
        var decisions = decision.getDecisions(new Encounter().setObservation("Complaint", ["Cold", "Body Ache", "Fever"]).setObservation("Paracheck", ["Positive for PF and PV"]).setGender("Male").setAge(25).setObservation("Weight", 40));
        var message = completeValue(decisions);
        expect((message.match(/क्लोरोक्विन/g) || []).length).to.equal(3, message);
        expect((message.match(/सेट्रीझीन/g) || []).length).to.equal(1, message);
        expect((message.match(/पॅरासिटामॉल/g) || []).length).to.equal(3, message);
    });

    it('Pick validation errors corresponding to all complaints', function () {
        var complaintConceptName = "Complaint";
        var validationResult = decision.validate(new Encounter().setObservation(complaintConceptName, ["Cold", "Acidity"]).setGender("Male").setAge(5).setObservation("Weight", 12))[0];
        expect(validationResult.success).to.equal(false, validationResult.message);
    });

    it('Multiple complaints and passing all validations', function () {
        var complaintConceptName = "Complaint";
        var validationResult = decision.validate(new Encounter().setObservation(complaintConceptName, ["Cold", "Acidity"]).setGender("Male").setAge(10).setObservation("Weight", 22))[0];
        expect(validationResult.success).to.equal(true, validationResult.message);
    });

    it('Alert should be only for the decision for the complaint', () => {
        var complaintConceptName = "Complaint";
        var decisions = decision.getDecisions(new Encounter().setObservation(complaintConceptName, ["Cold", "Vomiting"]).setGender("Male").setAge(10).setObservation("Weight", 22));
        expect(decisions[0].alert).to.equal(undefined);
        expect((decisions[1].alert.match(/उलटी असल्यास/g) || []).length).to.equal(1, decisions[0].alert);
    });

    it('Boundary condition of weight', () => {
        var complaintConceptName = "Complaint";
        var decisions = decision.getDecisions(new Encounter().setObservation(complaintConceptName, ["Fever"]).setGender("Male").setAge(10).setObservation("Weight", 5.5).setObservation("Paracheck", ["Positive PV"]));
        expect(decisions.length).to.equal(1);
    });

    it('Give malaria medicine based on paracheck being positive', () => {
        var complaintConceptName = "Complaint";
        var decisions = decision.getDecisions(new Encounter().setObservation(complaintConceptName, ["Cold"]).setGender("Male").setAge(10).setObservation("Weight", 5.5).setObservation("Paracheck", ["Positive PV"]));
        expect((decisions[0].value.match(/क्लोरोक्विन/g) || []).length).to.equal(3, decisions[0].value);
    });

    it('Give malaria medicine based on paracheck being positive - when fever is also specified', () => {
        var complaintConceptName = "Complaint";
        var decisions = decision.getDecisions(new Encounter().setObservation(complaintConceptName, ["Cold", "Fever"]).setGender("Male").setAge(10).setObservation("Weight", 8).setObservation("Paracheck", ["Positive PV"]));
        expect((decisions[0].value.match(/क्लोरोक्विन/g) || []).length).to.equal(3, decisions[0].value);
    });
    
    it('Fever, Body Ache & Vomiting', () => {
        var complaintConceptName = "Complaint";
        var decisions = decision.getDecisions(new Encounter().setObservation(complaintConceptName, ["Fever", "Body Ache", "Vomiting"]).setGender("Male").setAge(20).setObservation("Weight", 18));
        var message = completeValue(decisions);
        expect((message.match(/पॅरासिटामॉल/g) || []).length).to.equal(1, message);
        expect((message.match(/३ दिवस/g) || []).length).to.equal(3, message);
    });

    var completeValue = function (decisions) {
        var message = "";
        for (var i = 0; i < decisions.length; i++)
            message+= decisions[i].value;
        return message;
    }
});