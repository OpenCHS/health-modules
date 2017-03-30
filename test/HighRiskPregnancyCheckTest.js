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

        var riskFactorTypes = decisions.map(function (decision) {
            return decision.riskFactorType;
        });
        expect(riskFactorTypes.indexOf("Moderate and Severe Anemia")).is.not.equal(-1);
        expect(riskFactorTypes.indexOf("Convulsions")).is.not.equal(-1);
    });

    it('Check that decision for convulsions is correct', function () {
        var observations = [];
        observations.push(createObservation("Convulsions", false));
        var progEncounter = {};
        progEncounter.observations = observations;

        var decisions = mother.getDecision(progEncounter);

        var riskFactorTypes = decisions.map(function (decision) {
            return decision.riskFactorType;
        });
        expect(riskFactorTypes.indexOf("Convulsions")).is.equal(-1);
    });

    it('Check to show right suggestion for Anemia based on Hb result', function () {
        var observations = [];
        observations.push(createObservation("Hb", 4));
        var progEncounter = {};
        progEncounter.observations = observations;

        var decisions = mother.getDecision(progEncounter);
        var messages = decisions.map(function (decision) {
            return decision.message;
        });
        expect(messages.indexOf("Severe Anemia. Please refer to FRU")).is.not.equal(-1);
    });
});
