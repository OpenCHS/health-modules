const _ = require('../common');

//in days
const visitSchedule = {
    "ANC 1": {due: 40, max: 84},
    "ANC 2": {due: 98, max: 182},
    "ANC 3": {due: 196, max: 238},
    "ANC 4": {due: 252, max: 273},
    "Delivery": {due: 270, max: 280},
    "PNC 1": {due: 1, max: 1},
    "PNC 2": {due: 3, max: 3},
    "PNC 3": {due: 7, max: 7},
    "PNC 4": {due: 42, max: 42}
};

const getNextScheduledVisit = function (programEnrolment) {
    const lmpConceptName = 'Last Menstrual Period';
    
    const encounters = programEnrolment.encounters;
    const lmpDate = _.getDataFromObservation(programEnrolment.observations, lmpConceptName);
    const deliveryEncounter = programEnrolment.encounters.find(function (enc) {
        return enc.encounterType.name === 'Delivery';
    });

    const deliveryDate = deliveryEncounter !== undefined ? deliveryEncounter.actualDateTime : undefined;

    if (_.observationExists(programEnrolment.observations, lmpConceptName) && !_.encounterTypeExists(encounters, 'Abortion')) {
        if (_.encounterTypeExists(encounters, 'PNC 4')) return null;
        if (_.encounterTypeExists(encounters, 'PNC 3')) return createNextVisit(deliveryDate, 'PNC 4');
        if (_.encounterTypeExists(encounters, 'PNC 2')) return createNextVisit(deliveryDate, 'PNC 3');
        if (_.encounterTypeExists(encounters, 'PNC 1')) return createNextVisit(deliveryDate, 'PNC 2');
        if (_.encounterTypeExists(encounters, 'Delivery')) return createNextVisit(deliveryDate, 'PNC 1');
        if (_.encounterTypeExists(encounters, 'ANC 4')) return createNextVisit(lmpDate, 'Delivery');
        if (_.encounterTypeExists(encounters, 'ANC 3')) return createNextVisit(lmpDate, 'ANC 4');
        if (_.encounterTypeExists(encounters, 'ANC 2')) return createNextVisit(lmpDate, 'ANC 3');
        return createNextVisit(lmpDate, 'ANC 2');
    }

    return null;

    function createNextVisit(baseDate, visitName) {
        const schedule = visitSchedule[visitName];
        return {
            visitName: visitName,
            dueDate: _.addDays(baseDate, schedule.due),
            maxDate: _.addDays(baseDate, schedule.max)
        };
    }
};

module.exports = {
    getNextScheduledVisit: getNextScheduledVisit
};

