const programEncounterExports = {};
programEncounterExports.Mother = require('./mother/motherProgramEncounterDecision');
programEncounterExports.Child = require('./child/childProgramEncounterDecision');

const programEnrolmentExports = {};
programEnrolmentExports.Mother = require('./mother/motherProgramEnrolmentDecision');
programEnrolmentExports.Child = require('./child/childProgramEnrolmentDecision');

const programMetadataExports = {};
programMetadataExports.Child = require('./child/childProgramConfig');

module.exports = {
    programEncounterExports: programEncounterExports,
    programEnrolmentExports: programEnrolmentExports,
    programMetadataExports: programMetadataExports
};