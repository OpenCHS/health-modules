var expect = require('chai').expect;

describe('ProgramEncounterDecisionTest', () => {
    it('wiring', () => {
        var exports = require('../deployables/programEncounterDecision');
        expect(exports.getNextScheduledVisits).is.not.undefined;
    });
});