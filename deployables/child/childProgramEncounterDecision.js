const childAnthroImports = require('./childAnthropometrics');

var getDecisions = function (programEncounter, today) {
    return childAnthroImports.getDecisions(programEncounter, programEncounter.programEnrolment.individual, today);
};

module.exports = {
    getDecisions: getDecisions
};