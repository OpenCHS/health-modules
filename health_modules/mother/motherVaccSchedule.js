const C = require('../common');

var getVaccSchedule = function (programEnrolment) {
    const vaccScheduleItems = [];
    const lmpDate = programEnrolment.getObservationValue('Last Menstrual Period');

    //second trimester
    vaccScheduleItems.push(C.addVaccinationSchedule(lmpDate, "TT1", 0, 15));
    vaccScheduleItems.push(C.addVaccinationSchedule(lmpDate, "TT Booster", 0, 15));
    //at 6 weeks
    vaccScheduleItems.push(C.addVaccinationSchedule(lmpDate, "TT2", 42, 42));

    return {name: 'Vaccination Schedule', items: vaccScheduleItems, baseDate: lmpDate};
};

module.exports = {
    getVaccSchedule: getVaccSchedule
};