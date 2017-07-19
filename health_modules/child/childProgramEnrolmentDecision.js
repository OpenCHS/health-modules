const childVaccinationSchedule = require('./childVaccSchedule');

const getDecisions = function (programEnrolment, today) {
    return [];
};

const getChecklists = function (programEnrolment, today) {
    return [childVaccinationSchedule.getVaccSchedule(programEnrolment)];
};

module.exports = {
    getDecisions: getDecisions,
    getChecklists: getChecklists
};