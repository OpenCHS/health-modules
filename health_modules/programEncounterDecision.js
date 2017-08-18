const allImports = require('./programExports');

module.exports = {};

module.exports.getDecisions = function (programEncounter) {
    return allImports.execute({parameter: programEncounter, type: "encounter", fn: "getDecisions", defaultValue: {enrolmentDecisions: [], encounterDecisions: [], registrationDecisions: []}});
};

module.exports.getNextScheduledVisits = function (programEncounter) {
    return allImports.execute({parameter: programEncounter, type: "encounter", fn: "getNextScheduledVisits"});
};