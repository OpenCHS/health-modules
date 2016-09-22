var expect = require('chai').expect;
var decision = require('../modules/vhw/decision');
var RuleContext = require('./RuleContext');

describe('Make Decision', function () {
    it('Regression for all diseases, to ensure there are no exceptions and error messages', function () {
        var ruleContext = new RuleContext();

        Object.keys(decision.treatmentByComplaintAndCode).forEach(function (complaint) {
            decision.weightRangesToCode.forEach(function (weightRangeToCode) {
                ["Male", "Female"].forEach(function (gender) {
                    ruleContext.set("Complaint", [complaint]);
                    ruleContext.set("Weight", weightRangeToCode.start);
                    ruleContext.set("Sex", gender);
                    ruleContext.set("Age", 10);
                    console.log("##### {complaint}, {weightRangeToCode.start}, {gender} ######".replace("{complaint}", complaint).replace("{weightRangeToCode.start}", weightRangeToCode.start).replace("{gender}", gender));
                    if (decision.validate(ruleContext).passed) {
                        var decisions = decision.getDecision(ruleContext);
                        expect(decisions.length).to.equal(1);
                        expect(decisions[0].value.includes("undefined")).to.equal(false, decisions[0].value);
                    }
                });
            });
        });
    });

    it('Validate', function () {
        var complaintConceptName = "Complaint";
        var validationResult = decision.validate(new RuleContext().set(complaintConceptName, ["Pregnancy"]).set("Sex", "Male").set("Age", 25).set("Weight", 40));
        expect(validationResult.passed).to.equal(false, validationResult.message);

        validationResult = decision.validate(new RuleContext().set(complaintConceptName, ["Pregnancy"]).set("Age", 5).set("Sex", "Female").set("Weight", 40));
        expect(validationResult.passed).to.equal(false, validationResult.message);

        validationResult = decision.validate(new RuleContext().set(complaintConceptName, ["Pregnancy"]).set("Age", 3).set("Sex", "Female").set("Weight", 40));
        expect(validationResult.passed).to.equal(false, validationResult.message);

        validationResult = decision.validate(new RuleContext().set(complaintConceptName, ["Pregnancy"]).set("Age", 12).set("Sex", "Female").set("Weight", 40));
        expect(validationResult.passed).to.equal(true, validationResult.message);

        validationResult = decision.validate(new RuleContext().set(complaintConceptName, ["Chloroquine Resistant Malaria"]).set("Weight", 3).set("Sex", "Male"));
        expect(validationResult.passed).to.equal(false, validationResult.message);
    });

    it('Complaint which allows for prescription', function () {
        var decisions = decision.getDecision(new RuleContext().set("Complaint", ["Cold"]).set("Sex", "Male").set("Age", 25).set("Weight", 40));
        expect(decisions[0].value).to.not.equal(undefined);
        expect(decisions[0].alert).to.equal(undefined);
    })
    ;

    it('Do not give any medicine for chloroquin resistant malaria to women between 16-40', function () {
        var decisions = decision.getDecision(new RuleContext().set("Complaint", ["Chloroquine Resistant Malaria"]).set("Sex", "Female").set("Age", 25).set("Weight", 40));
        expect(decisions[0].value).to.equal("");
        expect(decisions[0].alert).to.not.equal(undefined);
    });

    it('Provide day wise instructions when specified for days separately', () => {
        var decisions = decision.getDecision(new RuleContext().set("Complaint", ["Malaria"]).set("Sex", "Male").set("Age", 25).set("Weight", 40));
        var chloroquinCount = (decisions[0].value.match(/क्लोरोक्विन/g) || []).length;
        expect(chloroquinCount).to.equal(3, decisions[0].value);
        var pcmCount = (decisions[0].value.match(/पॅरासिटामॉल/g) || []).length;
        expect(pcmCount).to.equal(3, decisions[0].value);
    });

    it('Do not provide day wise instructions when not specified for days separately', () => {
        var decisions = decision.getDecision(new RuleContext().set("Complaint", ["Cough"]).set("Sex", "Male").set("Age", 25).set("Weight", 40));
        var medicineCount = (decisions[0].value.match(/सेप्ट्रान/g) || []).length;
        expect(medicineCount).to.equal(1, decisions[0].value);
    });

    it('Print special instruction', () => {
        var decisions = decision.getDecision(new RuleContext().set("Complaint", ["Ring Worm"]).set("Sex", "Male").set("Age", 25).set("Weight", 40));
        var count = (decisions[0].value.match(/गजकर्णाच्या जागेवर लावण्यास सांगावे/g) || []).length;
        expect(count).to.equal(1, decisions[0].value);
    });
});