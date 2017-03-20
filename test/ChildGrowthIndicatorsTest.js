var expect = require('chai').expect;
var assert = require('chai').assert;
var getIndicators = require('../deployables/childGrowthIndicatorCalculator');

describe('Get growth indicators - z-score, grade, status for a child', function () {

    var progEnrolment;
    beforeEach(function () {
        progEnrolment = {
            program: {name: 'Child'},
            encounters: [{
                observations: [{concept: {name: 'Weight'}, valueJSON: {answer: 3.5}}, {concept: {name: 'Height'}, valueJSON: {answer: 50.1}}]
            }],
            individual: {dateOfBirth: new Date(2017, 1, 10)}
        };
    });

    it('Calculate age from birthdate', function () {
        var ageInMonths = getIndicators.getAgeInMonths(progEnrolment.individual.dateOfBirth, new Date(2017, 2, 20));
        expect(ageInMonths).is.equal(1);
    });

    it('Calculate Weight-for-Age Z Score, grade and status for female', function () {
        progEnrolment.individual.gender = {name: 'Female'};
        var matchingKey = getIndicators.getGrowthIndicators(progEnrolment);
        assert.equal('1', matchingKey.weightForAgeGrade);
        assert.equal('sd-1', matchingKey.weightForAgeZScore);
        assert.equal('Normal', matchingKey.weightForAgeStatus);
    });

    it('Calculate Weight-for-Age Z Score, grade and status for male', function(){
        progEnrolment.individual.gender = {name: 'male'};
        var matchingKey = getIndicators.getGrowthIndicators(progEnrolment);
        assert.equal('2', matchingKey.weightForAgeGrade);
        assert.equal('sd-2', matchingKey.weightForAgeZScore);
        assert.equal('Underweight', matchingKey.weightForAgeStatus);
    });

    it('Calculate Weight-for-Height Z Score, grade and status for female', function(){
        progEnrolment.individual.gender = {name: 'Female'};
        var matchingKey = getIndicators.getGrowthIndicators(progEnrolment);
        assert.equal('2', matchingKey.weightForHeightGrade);
        assert.equal('sd-2', matchingKey.weightForHeightZScore);
        assert.equal('Wasted', matchingKey.weightForHeightStatus);
    });

    it('Calculate Weight-for-Height Z Score, grade and status for male', function(){
        progEnrolment.individual.gender = {name: 'male'};
        var matchingKey = getIndicators.getGrowthIndicators(progEnrolment);
        console.log(matchingKey);
        assert.equal('2', matchingKey.weightForHeightGrade);
        assert.equal('sd-2', matchingKey.weightForHeightZScore);
        assert.equal('Wasted', matchingKey.weightForHeightStatus);
    });


});
