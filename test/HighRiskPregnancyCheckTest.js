var expect = require('chai').expect;
var mother = require('../deployables/mother/programEncounterDecision');

describe('Make Decision', function () {
    function createObservation(conceptName, value) {
        return {
            concept: {name: conceptName},
            valueJSON: {answer: value}
        };
    }

    it('Check to show right risk factor based on symptoms', function () {
        var observations = [];
        observations.push(createObservation("Hb", 4));
        observations.push(createObservation("Convulsions", true));
        var progEncounter = {};
        progEncounter.observations = observations;

        var decisions = mother.getDecision(progEncounter);

        var decisionValues = decisions.map(function (decision) {
            return decision.value;
        });
        expect(decisionValues.indexOf("Moderate and Severe Anemia")).is.not.equal(-1);
        expect(decisionValues.indexOf("Has convulsions. Continue to monitor. Refer to MO if condition not under control before 8th month")).is.not.equal(-1);
    });

    it('Check that decision for convulsions is correct', function () {
        var observations = [];
        observations.push(createObservation("Convulsions", false));
        var progEncounter = {};
        progEncounter.observations = observations;

        var decisions = mother.getDecision(progEncounter);

        var riskFactorTypes = decisions.map(function (decision) {
            return decision.name;
        });
        expect(riskFactorTypes.indexOf("Convulsions")).is.equal(-1);
    });

    it('Check to show right suggestion for Anemia based on Hb result', function () {
        var observations = [];
        observations.push(createObservation("Hb", 4));
        var progEncounter = {};
        progEncounter.observations = observations;

        var decisions = mother.getDecision(progEncounter);
        var decisionValues = decisions.map(function (decision) {
            return decision.value;
        });
        expect(decisionValues.indexOf("Severe Anemia. Refer to FRU")).is.not.equal(-1);
    });
});
