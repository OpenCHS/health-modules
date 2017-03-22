function C() {
    this.addDays = function(date, numberOfDays) {
        var copied = this.copyDate(date);
        copied.setDate(copied.getDate() + numberOfDays);
        return copied;
    };

    this.copyDate = function(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    this.getDataFromObservation = function(observations, obsName) {
        var matchingObservation = observations.find(function (obs) {
            return obs.concept.name === obsName;
        });
        return matchingObservation.valueJSON.answer;
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

    this.calculateBMI = function(observations, age) {
        if(age !== undefined) {
            var height = this.getDataFromObservation(observations, "Height");
            var weight = this.getDataFromObservation(observations, "Weight");
            return Math.floor((weight/Math.pow(height,2))*10000);
        }
    };

    this.getAgeInMonths = function (dateOfBirth, today) {
        today = this.copyDate(today === undefined ? new Date() : today);

        var birthDate = this.copyDate(dateOfBirth);
        var year1 = birthDate.getFullYear();
        var year2 = today.getFullYear();
        var month1 = birthDate.getMonth();
        var month2 = today.getMonth();
        if (month1 === 0) {
            month1++;
            month2++;
        }
        var numberOfMonths = (year2 - year1) * 12 + (month2 - month1);
        return (numberOfMonths);
    };
}

module.exports = new C();