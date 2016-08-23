import {expect} from 'chai';
import * as o from '../js/VHW_Lokbiradari';
import _ from 'lodash';
import RuleContext from './RuleContext';

describe('Make Decision', () => {
    it('Regression for all diseases, to ensure there are no exceptions and error messages', () => {
        var questionnaireAnswers = new RuleContext();

        _.keys(o.treatmentByDiagnosisAndCode).forEach((diagnosis) => {
            o.weightRangesToCode.forEach((weightRangeToCode) => {
                ["Male", "Female"].forEach((gender) => {
                    questionnaireAnswers.set("Diagnosis", diagnosis);
                    questionnaireAnswers.set("Weight", weightRangeToCode.start);
                    questionnaireAnswers.set("Sex", gender);
                    console.log(`##### ${diagnosis}, ${weightRangeToCode.start}, ${gender}  ######`);
                    var decisions = o.getDecision(questionnaireAnswers);
                    expect(decisions.length).to.equal(1);
                });
            });
        });
    });
});