var C = require('../common');

//in days
var visitSchedule = {
    "ANC 1" : {due: 40, max: 84},
    "ANC 2" : {due: 98, max: 182},
    "ANC 3" : {due: 196, max: 238},
    "ANC 4" : {due: 252, max: 273},
    "Delivery" : {due: 270, max: 280},
    "PNC 1" : {due: 1, max: 1},
    "PNC 2" : {due: 3, max: 3},
    "PNC 3" : {due: 7, max: 7},
    "PNC 4" : {due: 42, max: 42}
};

var getNextScheduledVisit = function (programEnrolment) {
    var observations = programEnrolment.observations;
    var encounters = programEnrolment.encounters;

    var lmpDate = C.getDataFromObservation(observations, 'Last Menstrual Period');
    var deliveryEncounter = programEnrolment.encounters.find(function (enc) {
        return enc.encounterType.name === 'Delivery';
    });

    var deliveryDate = deliveryEncounter !== undefined ? deliveryEncounter.actualDateTime : undefined;

    if (programEnrolment.program.name === 'Mother' && C.observationExists(observations,'Last Menstrual Period') && !C.encounterTypeExists(encounters,'Abortion')) {
        if (C.encounterTypeExists(encounters,'PNC 4')) return null;
        if (C.encounterTypeExists(encounters,'PNC 3')) return createNextVisit(deliveryDate, 'PNC 4');
        if (C.encounterTypeExists(encounters,'PNC 2')) return createNextVisit(deliveryDate, 'PNC 3');
        if (C.encounterTypeExists(encounters,'PNC 1')) return createNextVisit(deliveryDate, 'PNC 2');
        if (C.encounterTypeExists(encounters,'Delivery')) return createNextVisit(deliveryDate, 'PNC 1');
        if (C.encounterTypeExists(encounters,'ANC 4')) return createNextVisit(lmpDate, 'Delivery');
        if (C.encounterTypeExists(encounters,'ANC 3')) return createNextVisit(lmpDate, 'ANC 4');
        if (C.encounterTypeExists(encounters,'ANC 2')) return createNextVisit(lmpDate, 'ANC 3');
        return createNextVisit(lmpDate,'ANC 2');
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
    getNextScheduledVisit: getNextScheduledVisit
};

