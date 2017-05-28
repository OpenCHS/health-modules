const getObservationValue = function (conceptName) {
    return this.observations.get(conceptName);
};
const getObservationValueFromEntireEnrolment = function (conceptName) {
    return this.observations.get(conceptName);
};

const setObservation = function (conceptName, value) {
    this.observations.set(conceptName, value);
    return this;
};

const observationExists = function (conceptName) {
    return this.observations.has(conceptName);
};

const observationExistsInEntireEnrolment = function (conceptName) {
    return this.observations.has(conceptName);
};

function Encounter(encounterTypeName) {
    this.observations = new Map();
    this.individual = new Individual();
    this.encounterType = {name: encounterTypeName};

    this.setAge = function (years) {
        this.individual.setAge(years);
        return this;
    };

    this.setGender = function (genderName) {
        this.individual.setGender(genderName);
        return this;
    };
}

function Form() {
    this.findFormElement = function (formElementName) {
        return {name: formElementName, uuid: '299eae98-8582-4b1d-9595-35809531c255'};
    }
}

function Individual() {
    this.setAge = function (years) {
        this.years = years;
    };

    this.setGender = function (genderName) {
        this.gender = {};
        this.gender.name = genderName;
    };

    this.getAgeInYears = function (questionName) {
        return this.years;
    };
}

function ProgramEncounter(encounterTypeName, encounterDateTime, encounterName) {
    this.encounterType = {name: encounterTypeName};
    this.encounterDateTime = encounterDateTime;
    this.name = encounterName;
    this.observations = new Map();
}

function ProgramEnrolment(programName, encounters, individualDateOfBirth) {
    this.program = {name: programName};
    this.encounters = encounters;
    this.individual = new Individual();
    this.individual.dateOfBirth = individualDateOfBirth;
    this.observations = new Map();
}

const prototypes = [ProgramEncounter.prototype, Encounter.prototype, ProgramEnrolment.prototype];
prototypes.forEach(function (currentPrototype) {
    currentPrototype.getObservationValue = getObservationValue;
    currentPrototype.setObservation = setObservation;
    currentPrototype.observationExists = observationExists;
    currentPrototype.observationExistsInEntireEnrolment = observationExistsInEntireEnrolment;
    currentPrototype.getObservationValueFromEntireEnrolment = getObservationValueFromEntireEnrolment;
});

module.exports = {
    Encounter: Encounter,
    ProgramEncounter: ProgramEncounter,
    ProgramEnrolment: ProgramEnrolment,
    Individual: Individual,
    Form: Form
};