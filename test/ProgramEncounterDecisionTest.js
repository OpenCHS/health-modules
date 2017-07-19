var expect = require('chai').expect;

describe('ProgramEncounterDecisionTest', () => {
    it('wiring', () => {
        var exports = require('../health_modules/programEncounterDecision');
        expect(exports.getNextScheduledVisits).is.not.undefined;
    });
});