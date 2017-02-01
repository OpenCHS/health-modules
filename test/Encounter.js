function Encounter() {
    this.observations = new Map();
    this.individual = new Individual();

    this.getObservationValue = function (conceptName) {
        return this.observations.get(conceptName);
    };

    this.setObservation = function (conceptName, value) {
        this.observations.set(conceptName, value);
        return this;
    };

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

module.exports = Encounter;