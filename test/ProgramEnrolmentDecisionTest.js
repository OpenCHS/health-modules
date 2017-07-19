const expect = require('chai').expect;

describe('ProgramEncounterDecisionTest', () => {
    it('wiring', () => {
        const imports = require('../health_modules/programEnrolmentDecision');
        expect(imports.getNextScheduledVisits).is.not.undefined;
        expect(imports.getChecklists).is.not.undefined;
    });
});