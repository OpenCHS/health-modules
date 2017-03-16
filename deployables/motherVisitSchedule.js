var C = require('./common');

//ANC in weeks and PNC in days
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

    var lmpDate = getDateFromObservation('Last Menstrual Period');
    var deliveryEncounter = programEnrolment.encounters.find(function (enc) {
        return enc.encounterType.name === 'Delivery';
    });

    var deliveryDate = deliveryEncounter !== undefined ? deliveryEncounter.actualDateTime : undefined;

    if (programEnrolment.program.name === 'Mother' && observationExists('Last Menstrual Period') && !encounterTypeExists('Abortion')) {
        if (encounterTypeExists('PNC 4')) return null;
        if (encounterTypeExists('PNC 3')) return createNextVisit(deliveryDate, 'PNC 4');
        if (encounterTypeExists('PNC 2')) return createNextVisit(deliveryDate, 'PNC 3');
        if (encounterTypeExists('PNC 1')) return createNextVisit(deliveryDate, 'PNC 2');
        if (encounterTypeExists('Delivery')) return createNextVisit(deliveryDate, 'PNC 1');
        if (encounterTypeExists('ANC 4')) return createNextVisit(lmpDate, 'Delivery');
        if (encounterTypeExists('ANC 3')) return createNextVisit(lmpDate, 'ANC 4');
        if (encounterTypeExists('ANC 2')) return createNextVisit(lmpDate, 'ANC 3');

        return createNextVisit(lmpDate,'ANC 2');
    }

    return null;

    function getDateFromObservation(obsName) {
        var lmpObservation = programEnrolment.observations.find(function (obs) {
            return obs.concept.name === obsName;
        });
        return lmpObservation.valueJSON.answer;
    }

    function encounterTypeExists(name) {
        return encounters.some(function (encounter) {
                return encounter.encounterType.name === name;
            }
        )
    }

    function observationExists(name) {
        return observations.some(function (observation) {
            return observation.concept.name === name;
        });
    }

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

