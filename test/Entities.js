const getObservationValue = function (conceptName) {
    return this.observations.get(conceptName);
};

const setObservation = function (conceptName, value) {
    this.observations.set(conceptName, value);
    return this;
};

const observationExists = function (conceptName) {
    return this.observations.has(conceptName);
};

function Encounter() {
    this.observations = new Map();
    this.individual = new Individual();

    this.setAge = function (years) {
        this.individual.setAge(years);
        return this;
    };

    this.setGender = function (genderName) {
        this.individual.setGender(genderName);
        return this;
    };
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

function ProgramEncounter(encounterTypeName, encounterDateTime) {
    this.encounterType = {name: encounterTypeName};
    this.encounterDateTime = encounterDateTime;
    this.observations = new Map();
}

function ProgramEnrolment(programName, encounters, individualDateOfBirth) {
    this.program = {name: programName};
    this.encounters = encounters;
    this.individual = {dateOfBirth: individualDateOfBirth};
    this.observations = new Map();
}

const prototypes = [ProgramEncounter.prototype, Encounter.prototype, ProgramEnrolment.prototype];
prototypes.forEach(function (currentPrototype) {
    currentPrototype.getObservationValue = getObservationValue;
    currentPrototype.setObservation = setObservation;
    currentPrototype.observationExists = observationExists;
});

module.exports = {
    Encounter: Encounter,
    ProgramEncounter: ProgramEncounter,
    ProgramEnrolment: ProgramEnrolment
};