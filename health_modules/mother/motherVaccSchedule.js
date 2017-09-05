const C = require('../common');
const _ = require('lodash');

var getImmunisationSchedule = function (programEnrolment) {
    const vaccScheduleItems = [];
    const lmpDate = programEnrolment.getObservationValue('Last Menstrual Period');

    if (ttTakenAlreadyInPreviousPregnancy()) {
        var oneMonthBeforeDelivery = C.addDays(lmpDate, 280 - 30);
        vaccScheduleItems.push(C.addChecklistItem(lmpDate, "TT Booster", oneMonthBeforeDelivery, oneMonthBeforeDelivery));
    } else {
        vaccScheduleItems.push(C.addChecklistItem(lmpDate, "TT 1", 13 * 7, 21 * 7));
    }

    return {name: 'Vaccination Schedule', items: vaccScheduleItems, baseDate: lmpDate};
};

let ttTakenAlreadyInPreviousPregnancy = function (programEnrolment) {
    const ttInjections = programEnrolment.findObservation("TT injections taken");
    var taken = !_.isEmpty(ttInjections) && ttInjections.numberOfAnswers === 2;
    if (!taken) {
        return ttTakenAlreadyInPreviousPregnancy(programEnrolment.individual)
    }
};

module.exports = {
    getVaccSchedule: getImmunisationSchedule
};