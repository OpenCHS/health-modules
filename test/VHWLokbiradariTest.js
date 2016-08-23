import {expect} from 'chai';
import {treatmentByDiagnosisAndCode, weightRangesToCode, getDecision} from '../modules/vhw/decision';
import _ from 'lodash';
import RuleContext from './RuleContext';

describe('Make Decision', () => {
    it('Regression for all diseases, to ensure there are no exceptions and error messages', () => {
        var questionnaireAnswers = new RuleContext();

        _.keys(treatmentByDiagnosisAndCode).forEach((diagnosis) => {
            weightRangesToCode.forEach((weightRangeToCode) => {
                ["Male", "Female"].forEach((gender) => {
                    questionnaireAnswers.set("Diagnosis", diagnosis);
                    questionnaireAnswers.set("Weight", weightRangeToCode.start);
                    questionnaireAnswers.set("Sex", gender);
                    questionnaireAnswers.set("Age", 10);
                    console.log(`##### ${diagnosis}, ${weightRangeToCode.start}, ${gender}  ######`);
                    var decisions = getDecision(questionnaireAnswers);
                    expect(decisions.length).to.equal(1);
                });
            });
        });
    });
});