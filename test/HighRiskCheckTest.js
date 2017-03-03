var expect = require('chai').expect;
var getDecision = require('../deployables/programEncounter');

describe('Make Decision', function () {

    it('Check to show right risk factor based on symptoms', function () {
        var observations = [];
        observation = {
            concept: {name: "Hb"},
            valueJSON: {answer: 4}
        };
        observations.push(observation);
        observation = {
            concept: {name: "Convulsions"},
            valueJSON: {answer: 'Yes'}
        };
        observations.push(observation);
        var progEncounter = {};
        progEncounter.observations = observations;
        var decisions = getDecision.getDecision(progEncounter);
        var riskFactorTypes = decisions.map(function(decision) {
            return decision.riskFactorType;
        });
        expect(riskFactorTypes.indexOf("Moderate and Severe Anemia")).is.not.equal(-1);
        expect(riskFactorTypes.indexOf("Convulsions")).is.not.equal(-1);
        console.log(riskFactorTypes);
    });

    it('Check to show right suggestion for Anemia based on Hb result', function () {
        var observations = [];
        var observation = {
            concept: {name: "Hb"},
            valueJSON: {answer: 4}
        };
        observations.push(observation);
        var progEncounter = {};
        progEncounter.observations = observations;

        var decision = getDecision.getDecision(progEncounter);
        expect(decision).is.equal('Severe. Please refer to FRU');
        console.log(decision);
    });

    it('Check to show right suggestion for Anemia based on Hb result when anemia is not the first observation', function () {
        var observations = [];
        var observation = {
            concept: {name: "Pallor"},
            valueJSON: {answer: 'Yes'}
        };
        observations.push(observation);
        observation = {
            concept: {name: "Hb"},
            valueJSON: {answer: 4}
        };
        observations.push(observation);
        var progEncounter = {};
        progEncounter.observations = observations;

        var decision = getDecision.getDecision(progEncounter);
        expect(decision).is.equal('Severe. Please refer to FRU');
        console.log(decision);
    });

});
