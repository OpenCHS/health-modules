var expect = require('chai').expect;

describe('ProgramEncounterDecisionTest', () => {
    it('wiring', () => {
        var exports = require('../deployables/programEnrolmentDecision');
        expect(exports.getNextScheduledVisits).is.not.undefined;
    });
});