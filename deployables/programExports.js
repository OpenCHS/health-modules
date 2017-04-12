const programEncounterExports = {};
programEncounterExports.Mother = require('./mother/motherProgramEncounterDecision');
programEncounterExports.Child = require('./child/childProgramEncounterDecision');

const programEnrolmentExports = {};
programEnrolmentExports.Mother = require('./mother/motherProgramEnrolmentDecision');
programEnrolmentExports.Child = require('./child/childProgramEnrolmentDecision');

module.exports = {
    programEncounterExports: programEncounterExports,
    programEnrolmentExports: programEnrolmentExports
};