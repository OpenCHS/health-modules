var C = require('../common');

//in days
var visitSchedule = {
    "PNC 1" : {due: 1, max: 1},
    "PNC 2" : {due: 3, max: 3},
    "PNC 3" : {due: 7, max: 7},
    "PNC 4" : {due: 42, max: 42}
};

var getNextScheduledVisits = function (programEnrolment) {
    var observations = programEnrolment.observations;
    var encounters = programEnrolment.encounters;


    var deliveryDate = observations !== undefined ? C.getDataFromObservation(observations, 'Date of Delivery') : undefined;

    if (programEnrolment.program.name === 'Child' && C.observationExists(observations,'Date of Delivery')) {
        if (C.encounterTypeExists(encounters,'PNC 4')) return null;
        if (C.encounterTypeExists(encounters,'PNC 3')) return createNextVisit(deliveryDate, 'PNC 4');
        if (C.encounterTypeExists(encounters,'PNC 2')) return createNextVisit(deliveryDate, 'PNC 3');
        if (C.encounterTypeExists(encounters,'PNC 1')) return createNextVisit(deliveryDate, 'PNC 2');
        return createNextVisit(deliveryDate, 'PNC 1');

    }
    return null;

    function createNextVisit(baseDate, visitName) {
        var schedule = visitSchedule[visitName];
        return {
            visitName: visitName,
            dueDate: C.addDays(C.copyDate(baseDate), schedule.due),
            maxDate: C.addDays(C.copyDate(baseDate), schedule.max)
        };
    }
};

module.exports = {
    getNextScheduledVisits: getNextScheduledVisits
};

