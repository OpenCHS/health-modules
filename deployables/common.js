function C() {
    this.addDays = function(date, numberOfDays) {
        var copied = this.copyDate(date);
        copied.setDate(copied.getDate() + numberOfDays);
        return copied;
    };

    this.copyDate = function(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    this.getDateFromObservation = function(observations, obsName) {
        var lmpObservation = observations.find(function (obs) {
            return obs.concept.name === obsName;
        });
        return lmpObservation.valueJSON.answer;
    };

    this.encounterTypeExists = function(encounters, name) {
        return encounters.some(function (encounter) {
                return encounter.encounterType.name === name;
            }
        )
    };

    this.observationExists = function(observations, name) {
        return observations.some(function (observation) {
            return observation.concept.name === name;
        });
    };
}

module.exports = new C();