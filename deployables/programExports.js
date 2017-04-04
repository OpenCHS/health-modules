const programEncounterExports = {};
programEncounterExports.Mother = require('./mother/motherProgramEncounterDecision');

const programEnrolmentExports = {};
programEnrolmentExports.Mother = require('./mother/motherProgramEnrolmentDecision');

module.exports = {
    programEncounterExports: programEncounterExports,
    programEnrolmentExports: programEnrolmentExports
};