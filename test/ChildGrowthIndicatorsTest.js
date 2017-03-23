var expect = require('chai').expect;
var assert = require('chai').assert;
var getIndicators = require('../deployables/childGrowthIndicatorCalculator');
var C = require('../deployables/common');
var weightForHeightScores = require('../deployables/json/weightForHeight');

describe('Get growth indicators - z-score, grade, status for a child', function () {
    var progEnrolment;
    beforeEach(function () {
        progEnrolment = {
            program: {name: 'Child'},
            encounters: [{
                observations: [{concept: {name: 'Weight'}, valueJSON: {answer: 3.5}}, {concept: {name: 'Height'}, valueJSON: {answer: 50.1}}]
            }],
            individual: {dateOfBirth: new Date(2015, 1, 10)}
        };
    });

    it('Find closest Length from Z_Score table', function(){
        progEnrolment.individual.gender = {name: 'Female'};
        var weightForHeightGenderValues =  weightForHeightScores.female;
        var matchingKey = C.getMatchingKey(48.4, weightForHeightGenderValues);
        assert.equal(48.5,matchingKey);
    });

    it('Calculate BMI', function(){
        progEnrolment.individual.gender = {name: 'male'};
        var ageInMonths = C.getAgeInMonths(progEnrolment.individual.dateOfBirth, new Date(2017, 2, 20));
        var lastEncounter = progEnrolment.encounters.pop();
        var BMI = C.calculateBMI(lastEncounter.observations, ageInMonths);
        assert.equal(13, BMI);
    });

    it('Calculate age from birthdate', function () {
        var ageInMonths = C.getAgeInMonths(progEnrolment.individual.dateOfBirth, new Date(2017, 2, 20));
        expect(ageInMonths).is.equal(25);
    });

    const findValue = function(decisions, name) {
        var matchingDecision = decisions.find(function (decision) {
            return decision.name === name;
        });
        return matchingDecision.value;
    };

    it('Calculate Weight-for-Age Z Score, grade and status for female', function () {
        progEnrolment.individual.gender = {name: 'Female'};
        var decisions = getIndicators.getGrowthIndicators(progEnrolment);
        assert.equal('1', findValue(decisions, 'WeightForAge Grade'));
        assert.equal('sd-1', findValue(decisions,'WeightForAge Z-Score'));
        assert.equal('Normal', findValue(decisions, 'WeightForAge Status'));
    });

    it('Calculate Weight-for-Age Z Score, grade and status for male', function(){
        progEnrolment.individual.gender = {name: 'male'};
        var decisions = getIndicators.getGrowthIndicators(progEnrolment);
        assert.equal('2', findValue(decisions, 'WeightForAge Grade'));
        assert.equal('sd-2', findValue(decisions,'WeightForAge Z-Score'));
        assert.equal('Underweight', findValue(decisions, 'WeightForAge Status'));
    });

    it('Calculate Height-for-Age Z Score, grade and status for female', function(){
        progEnrolment.individual.gender = {name: 'Female'};
        var decisions = getIndicators.getGrowthIndicators(progEnrolment);
        assert.equal('2', findValue(decisions,'HeightForAge Grade'));
        assert.equal('sd-2', findValue(decisions, 'HeightForAge Z-Score'));
        assert.equal('Stunted', findValue(decisions,'HeightForAge Status'));
    });

    it('Calculate Height-for-Age Z Score, grade and status for male', function(){
        progEnrolment.individual.gender = {name: 'male'};
        var decisions = getIndicators.getGrowthIndicators(progEnrolment);
        assert.equal('2', findValue(decisions,'HeightForAge Grade'));
        assert.equal('sd-2', findValue(decisions,'HeightForAge Z-Score'));
        assert.equal('Stunted', findValue(decisions,'HeightForAge Status'));
    });

    it('Calculate Weight-for-Height Z Score for female', function(){
        progEnrolment.individual.gender = {name: 'Female'};
        var decisions = getIndicators.getGrowthIndicators(progEnrolment);
        assert.equal('sd0', findValue(decisions,'WeightForHeight Z-Score'));
    });
});
