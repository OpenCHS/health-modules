const childAnthroImports = require('./childAnthropometrics');
const childVaccinationSchedule = require('./childVaccSchedule');

const getDecisions = function (programEnrolment, today) {
    return childAnthroImports.getDecisions(programEnrolment, programEnrolment.individual, today);
};

const getChecklists = function (programEnrolment, today) {
    return [childVaccinationSchedule.getVaccSchedule(programEnrolment)];
};

module.exports = {
    getDecisions: getDecisions,
    getChecklists: getChecklists
};