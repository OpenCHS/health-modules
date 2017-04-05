function C() {
    this.addDays = function (date, numberOfDays) {
        const copied = this.copyDate(date);
        copied.setDate(copied.getDate() + numberOfDays);
        return copied;
    };

    this.copyDate = function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    this.encounterTypeExists = function (encounters, name) {
        return encounters.some(function (encounter) {
                return encounter.encounterType.name === name;
            }
        )
    };

    this.calculateBMI = function (weight, height, age) {
        if (age !== undefined) {
            return Math.floor((weight / Math.pow(height, 2)) * 10000);
        }
    };

    /* todo
     handle case to increment # of month if day of month > 20
     */
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

    this.getMatchingKey = function (obsValue, masterData) {
        var keys = Object.keys(masterData);
        for (var i = 0; i < keys.length; i++) {
            var currentLength = masterData[i].length;
            var nextLength = masterData[i + 1].length;
            var currentKeyDifference = Math.abs(obsValue - currentLength);
            var nextKeyDifference = Math.abs(obsValue - nextLength);
            if (nextKeyDifference < currentKeyDifference) continue;
            else return currentLength;
        }
    };
}

module.exports = new C();