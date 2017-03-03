var expect = require('chai').expect;
var getDecision = require('../deployables/programEncounter');

describe('Make Decision', function () {
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
