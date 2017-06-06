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

const getNextScheduledVisits = function (programEnrolment, today, currentEncounter) {
    const lmpConceptName = 'Last Menstrual Period';
    const encounters = programEnrolment.encounters.slice();
    const lmpDate = programEnrolment.getObservationValue(lmpConceptName);
    const deliveryEncounter = programEnrolment.encounters.find(function (enc) {
        return enc.encounterType.name === 'Delivery';
    });
    const deliveryDate = deliveryEncounter !== undefined ? deliveryEncounter.encounterDateTime : undefined;

    if (currentEncounter !== undefined) {
        encounters.push(currentEncounter);
    }

    console.log(lmpConceptName + ": " + lmpDate + ", Abortion Happened: " + _.encounterExists(encounters, 'Abortion'));

    if (programEnrolment.observationExists(lmpConceptName) && !_.encounterExists(encounters, 'Abortion')) {
        if (_.encounterExists(encounters, 'PNC', 'PNC 4')) return [];
        if (_.encounterExists(encounters, 'PNC', 'PNC 3')) return createNextVisit(deliveryDate, 'PNC', 'PNC 4');
        if (_.encounterExists(encounters, 'PNC', 'PNC 2')) return createNextVisit(deliveryDate, 'PNC', 'PNC 3');
        if (_.encounterExists(encounters, 'PNC', 'PNC 1')) return createNextVisit(deliveryDate, 'PNC', 'PNC 2');
        if (_.encounterExists(encounters, 'ANC', 'Delivery')) return createNextVisit(deliveryDate, 'PNC', 'PNC 1');
        if (_.encounterExists(encounters, 'ANC', 'ANC 4')) return createNextVisit(lmpDate, 'Delivery');
        if (_.encounterExists(encounters, 'ANC', 'ANC 3')) return createNextVisit(lmpDate, 'ANC', 'ANC 4');
        if (_.encounterExists(encounters, 'ANC', 'ANC 2')) return createNextVisit(lmpDate, 'ANC', 'ANC 3');
        return createNextVisit(lmpDate, 'ANC', 'ANC 2');
    }

    return [];

    function createNextVisit(baseDate, encounterType, name) {
        const schedule = visitSchedule[name];
        return [{
            name: name,
            encounterType: encounterType,
            dueDate: _.addDays(baseDate, schedule.due),
            maxDate: _.addDays(baseDate, schedule.max)
        }];
    }
};

module.exports = {
    getNextScheduledVisits: getNextScheduledVisits
};

