import {expect} from 'chai';
import {treatmentByDiagnosisAndCode, weightRangesToCode, getDecision, validate} from '../modules/vhw/decision';
import _ from 'lodash';
import RuleContext from './RuleContext';

describe('Make Decision', () => {
    it('Regression for all diseases, to ensure there are no exceptions and error messages', () => {
        var ruleContext = new RuleContext();

        _.keys(treatmentByDiagnosisAndCode).forEach((diagnosis) => {
            weightRangesToCode.forEach((weightRangeToCode) => {
                ["Male", "Female"].forEach((gender) => {
                    ruleContext.set("Diagnosis", [diagnosis]);
                    ruleContext.set("Weight", weightRangeToCode.start);
                    ruleContext.set("Sex", gender);
                    ruleContext.set("Age", 10);
                    console.log(`##### ${diagnosis}, ${weightRangeToCode.start}, ${gender}  ######`);
                    var decisions = getDecision(ruleContext);
                    expect(decisions.length).to.equal(1);
                });
            });
        });
    });

    it('Validate', () => {
        var ruleContext = new RuleContext().set("Diagnosis", "Pregnancy").set("Sex", "Male");
        expect(validate(ruleContext).passed).to.equal(false);

        ruleContext = new RuleContext().set("Diagnosis", "Pregnancy").set("Age", 5);
        expect(validate(ruleContext).passed).to.equal(false);

        ruleContext = new RuleContext().set("Diagnosis", "Pregnancy").set("Age", 12);
        expect(validate(ruleContext).passed).to.equal(true);
    });
});