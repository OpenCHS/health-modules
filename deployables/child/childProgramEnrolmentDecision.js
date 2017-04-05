const childAnthroImports = require('./childAnthropometrics');

var getDecisions = function (programEnrolment, today) {
    return childAnthroImports.getDecisions(programEnrolment, programEnrolment.individual, today);
};

module.exports = {
    getDecisions: getDecisions
};