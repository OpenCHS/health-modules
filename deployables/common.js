function C() {

    this.itemAtIndex = function(index, array) {
        return array && array.find(function(item, idx) {return idx === index}) || undefined;
    };

    this.addDays = function (date, numberOfDays) {
        const copied = this.copyDate(date);
        copied.setDate(copied.getDate() + numberOfDays);
        return copied;
    };

    this.copyDate = function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    this.encounterExists = function (encounters, encounterTypeName, encounterName) {
        return encounters.some(function (encounter) {
                return encounter.encounterType.name === encounterTypeName && encounter.name === encounterName;
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
        today = this.copyDate(today);

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

    this.getWeeks = function (lmpDate, today) {
        return (Math.round((today - lmpDate)/ 604800000));
    };

    this.getDays = function (firstDate, secondDate) {
        var oneDay = 24*60*60*1000;
        return (Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay))));
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

    this.contains = function (array, value) {
        if (array === undefined || array === null) return false;

        return array.some(function (arrayItem) {
            return arrayItem === value;
        });
    };

    this.decision = function (name, value, scope) {
        return {name: name, value: value};
    };

    this.findValue = function(decisions, name) {
        var matchingDecision = decisions.find(function (decision) {
            return decision.name === name;
        });
        return matchingDecision ? matchingDecision.value : null;
    };

    this.createValidationResult = function (success, messageKey) {
        return {success: false, messageKey: messageKey};
    };

    this.createValidationError = function (messageKey) {
        return this.createValidationResult(false, messageKey);
    }
}

module.exports = new C();