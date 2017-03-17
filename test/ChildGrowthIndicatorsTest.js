var expect = require('chai').expect;
var assert = require('chai').assert;
var getIndicators = require('../deployables/childGrowthIndicatorCalculator');

describe('Get growth indicators - z-score, grade, status for a child', function () {
    var progEnrolment = {
        program: {name: 'Child'},
        individual: {dateOfBirth: new Date(2017,1,10),Gender: {name:'Female'}},
        encounters: [{observations: [{concept: {name: 'Weight'}, valueJSON:{answer: 3.5}}]
        }]
    };
/*
    it('Calculate age from birthdate', function(){
        var ageInMonths = getIndicators.getGrowthIndicators(progEnrolment);
        expect(ageInMonths).is.equal(1);
    });
*/
    it('Calculate Z Score from birthdate', function(){
        var matchingObservation = getIndicators.getGrowthIndicators(progEnrolment);
        assert.equal(true, matchingObservation.month, 1);
    });

});
