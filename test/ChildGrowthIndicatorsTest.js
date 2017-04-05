const expect = require('chai').expect;
const assert = require('chai').assert;
const getDecisions = require('../deployables/child/childProgramEncounterDecision');
const C = require('../deployables/common');
const weightForHeightScores = require('../deployables/json/weightForHeight');
const ProgramEncounter = require("./Entities").ProgramEncounter;
const ProgramEnrolment = require("./Entities").ProgramEnrolment;

describe('Get growth indicators - z-score, grade, status for a child', function () {
    var enrolment;
    var programEncounter;
    const referenceDate = new Date(2017, 2, 20);

    beforeEach(function () {
        enrolment = new ProgramEnrolment('Child', [programEncounter], new Date(2015, 1, 10));

        programEncounter = new ProgramEncounter();
        programEncounter.setObservation('Weight', 3.5).setObservation('Height', 50.1);
        programEncounter.programEnrolment = enrolment;
    });

    it('Find closest Length from Z_Score table', function(){
        enrolment.individual.gender = {name: 'Female'};
        var weightForHeightGenderValues =  weightForHeightScores.female;
        var matchingKey = C.getMatchingKey(48.4, weightForHeightGenderValues);
        assert.equal(48.5,matchingKey);
    });

    it('Calculate BMI', function(){
        enrolment.individual.gender = {name: 'male'};
        var ageInMonths = C.getAgeInMonths(enrolment.individual.dateOfBirth, referenceDate);
        var lastEncounter = enrolment.encounters.pop();
        var BMI = C.calculateBMI(3.5, 50.1, ageInMonths);
        assert.equal(13, BMI);
    });

    it('Calculate age from birthdate', function () {
        var ageInMonths = C.getAgeInMonths(enrolment.individual.dateOfBirth, referenceDate);
        expect(ageInMonths).is.equal(25);
    });

    const findValue = function(decisions, name) {
        var matchingDecision = decisions.find(function (decision) {
            return decision.name === name;
        });
        return matchingDecision.value;
    };

    it('Calculate Weight-for-Age Z Score, grade and status for female', function () {
        enrolment.individual.gender = {name: 'Female'};
        var decisions = getDecisions.getDecisions(programEncounter, referenceDate);
        assert.equal('1', findValue(decisions, 'Weight for age grade'));
        assert.equal('sd-1', findValue(decisions,'Weight for age z-score'));
        assert.equal('Normal', findValue(decisions, 'Weight for age status'));
    });

    it('Calculate Weight-for-Age Z Score, grade and status for male', function(){
        enrolment.individual.gender = {name: 'male'};
        var decisions = getDecisions.getDecisions(programEncounter, referenceDate);
        assert.equal('2', findValue(decisions, 'Weight for age grade'));
        assert.equal('sd-2', findValue(decisions,'Weight for age z-score'));
        assert.equal('Underweight', findValue(decisions, 'Weight for age status'));
    });

    it('Calculate Height-for-Age Z Score, grade and status for female', function(){
        enrolment.individual.gender = {name: 'Female'};
        var decisions = getDecisions.getDecisions(programEncounter, referenceDate);
        assert.equal('2', findValue(decisions,'Height for age grade'));
        assert.equal('sd-2', findValue(decisions, 'Height for age z-score'));
        assert.equal('Stunted', findValue(decisions,'Height for age status'));
    });

    it('Calculate Height-for-Age Z Score, grade and status for male', function(){
        enrolment.individual.gender = {name: 'male'};
        var decisions = getDecisions.getDecisions(programEncounter, referenceDate);
        assert.equal('2', findValue(decisions,'Height for age grade'));
        assert.equal('sd-2', findValue(decisions,'Height for age z-score'));
        assert.equal('Stunted', findValue(decisions,'Height for age status'));
    });

    it('Calculate Weight-for-Height Z Score for female', function(){
        enrolment.individual.gender = {name: 'Female'};
        var decisions = getDecisions.getDecisions(programEncounter, referenceDate);
        assert.equal('sd0', findValue(decisions,'Weight for height z-score'));
    });
});
