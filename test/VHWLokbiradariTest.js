import {expect} from 'chai';
import {treatmentByComplaintAndCode, weightRangesToCode, getDecision, validate} from '../modules/vhw/decision';
import _ from 'lodash';
import RuleContext from './RuleContext';

describe('Make Decision', () => {
    it('Regression for all diseases, to ensure there are no exceptions and error messages', () => {
        var ruleContext = new RuleContext();

        _.keys(treatmentByComplaintAndCode).forEach((complaint) => {
            weightRangesToCode.forEach((weightRangeToCode) => {
                ["Male", "Female"].forEach((gender) => {
                    ruleContext.set("Complaint", [complaint]);
                    ruleContext.set("Weight", weightRangeToCode.start);
                    ruleContext.set("Sex", gender);
                    ruleContext.set("Age", 10);
                    console.log(`##### ${complaint}, ${weightRangeToCode.start}, ${gender}  ######`);
                    if (validate(ruleContext).passed) {
                        var decisions = getDecision(ruleContext);
                        expect(decisions.length).to.equal(1);
                    }
                });
            });
        });
    });

    it('Validate', () => {
        var complaintConceptName = "Complaint";
        var validationResult = validate(new RuleContext().set(complaintConceptName, ["Pregnancy"]).set("Sex", "Male").set("Age", "25").set("Weight", 40));
        expect(validationResult.passed).to.equal(false, validationResult.message);

        validationResult = validate(new RuleContext().set(complaintConceptName, ["Pregnancy"]).set("Age", 5).set("Sex", "Female").set("Weight", 40));
        expect(validationResult.passed).to.equal(false, validationResult.message);

        validationResult = validate(new RuleContext().set(complaintConceptName, ["Pregnancy"]).set("Age", 12).set("Sex", "Female").set("Weight", 40));
        expect(validationResult.passed).to.equal(true, validationResult.message);

        validationResult = validate(new RuleContext().set(complaintConceptName, ["Chloroquine Resistant Malaria"]).set("Weight", 3).set("Sex", "Male"));
        expect(validationResult.passed).to.equal(false, validationResult.message);
    });
});