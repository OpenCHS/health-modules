const programEncounterExports = {};
programEncounterExports.Mother = require('./mother/motherProgramEncounterDecision');
programEncounterExports.Child = require('./child/childProgramEncounterDecision');

const programEnrolmentExports = {};
programEnrolmentExports.Mother = require('./mother/motherProgramEnrolmentDecision');
programEnrolmentExports.Child = require('./child/childProgramEnrolmentDecision');

const programConfigExports = {};
programConfigExports.Child = require('./child/childProgramConfig');

module.exports = {};

module.exports.executeProgramEnrolmentFunc = function (enrolment, funcName, today) {
    today = today === undefined ? new Date() : today;
    const programEnrolmentExport = programEnrolmentExports[enrolment.program.name];
    if (programEnrolmentExport === undefined) {
        console.log('(ProgramExports) No program enrolment rule set for program: ' + enrolment.program.name);
        return [];
    }
    if (programEnrolmentExport[funcName] === undefined) {
        console.log('(ProgramExports) No program enrolment rule for ' + funcName + ' for program: ' + enrolment.program.name);
        return [];
    }
    programEnrolmentExport[funcName](enrolment, today);
};

module.exports.executeProgramEncounterFunc = function (programEncounter, funcName, today) {
    today = today === undefined ? new Date() : today;
    const programName = programEncounter.programEnrolment.program.name;
    const programEncounterExport = programEncounterExports[programName];
    if (programEncounterExport === undefined) {
        console.log('(ProgramExports) No program encounter rule set for program: ' + programName);
        return [];
    }
    if (programEncounterExport[funcName] === undefined) {
        console.log('(ProgramExports) No program encounter rule for ' + funcName + ' for program: ' + programName);
        return [];
    }
    return programEncounterExport[funcName](programEncounter, today);
};

module.exports.programConfig = programConfigExports;