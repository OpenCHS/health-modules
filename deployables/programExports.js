const programEncounterExports = {};
programEncounterExports.Mother = require('./mother/motherProgramEncounterDecision');
programEncounterExports.Child = require('./child/childProgramEncounterDecision');

const programEnrolmentExports = {};
programEnrolmentExports.Mother = require('./mother/motherProgramEnrolmentDecision');

module.exports = {
    programEncounterExports: programEncounterExports,
    programEnrolmentExports: programEnrolmentExports
};