var C = require('./common');
var weightForAgeScores = require('../deployables/json/weightForAge');
var weightForHeightScores = require('../deployables/json/weightForHeight');

var getGrowthIndicators = function (programEnrolment, today) {
    today = C.copyDate(today === undefined ? new Date() : today);

    var lastEncounter = programEnrolment.encounters.pop();
    var dateOfBirth = programEnrolment.individual.dateOfBirth;
    var weightForAgeZScore;
    var weightForHeightZScore;

    var zScoreGradeMappingWeightForAge = {
        'sd0': function () {
            return 1
        },
        'sd-1': function () {
            return 1
        },
        'sd-2': function () {
            return 2
        },
        'sd-3': function () {
            return 3
        }
    };
    var zScoreStatusMappingWeightForAge = {
        'sd0': function () {
            return 'Normal'
        },
        'sd-1': function () {
            return 'Normal'
        },
        'sd-2': function () {
            return 'Underweight'
        },
        'sd-3': function () {
            return 'Severely Underweight'
        }
    };

    var zScoreStatusMappingWeightForHeight = {
        'sd3': function () {
            return 'Obese'
        },
        'sd2': function () {
            return 'Overweight'
        },
        'sd1': function () {
            return 'Possible risk of overweight'
        },
        'sd0': function () {
            return 'Normal'
        },
        'sd-1': function () {
            return 'Normal'
        },
        'sd-2': function () {
            return 'Wasted'
        },
        'sd-3': function () {
            return 'Severely wasted'
        }
    };

    var zScoreGradeMappingWeightForHeight = {
        'sd3': function () {
            return 1
        },
        'sd2': function () {
            return 1
        },
        'sd1': function () {
            return 1
        },
        'sd0': function () {
            return 1
        },
        'sd-1': function () {
            return 1
        },
        'sd-2': function () {
            return 2
        },
        'sd-3': function () {
            return 3
        }
    };


    var weightForAgeGenderValues = programEnrolment.individual.gender.name === 'Female' ? weightForAgeScores.female : weightForAgeScores.male;
    var weightForHeightGenderValues = programEnrolment.individual.gender.name === 'Female' ? weightForHeightScores.female : weightForHeightScores.male;
    
    weightForAgeZScore = lastEncounter === undefined ? getZScore(C.getDataFromObservation(lastEncounter.observations, 'Weight'), weightForAgeGenderValues, getAgeInMonths(dateOfBirth, today)) : getZScore(C.getDataFromObservation(lastEncounter.observations, 'Weight'), weightForAgeGenderValues, getAgeInMonths(dateOfBirth, today));

    weightForHeightZScore = lastEncounter === undefined ? getZScore(C.getDataFromObservation(lastEncounter.observations, 'Height'), weightForHeightGenderValues, getAgeInMonths(dateOfBirth, today)) : getZScore(C.getDataFromObservation(lastEncounter.observations, 'Height'), weightForHeightGenderValues, getAgeInMonths(dateOfBirth, today));

    return {
        weightForAgeZScore: weightForAgeZScore,
        weightForAgeGrade: zScoreGradeMappingWeightForAge[weightForAgeZScore](),
        weightForAgeStatus: zScoreStatusMappingWeightForAge[weightForAgeZScore](),
        
        weightForHeightZScore: weightForHeightZScore,
        weightForHeightGrade: zScoreGradeMappingWeightForHeight[weightForHeightZScore](),
        weightForHeightStatus: zScoreStatusMappingWeightForHeight[weightForHeightZScore]()
    };

    function getZScore(obsValue, masterData, age) {
        var matchingObject = masterData.find(function (obs) {
            return obs.month === age;
        });
        var keys = Object.keys(matchingObject);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === 'month') continue;

            var currentKeyDifference = Math.abs(obsValue - matchingObject[keys[i]]);
            var nextKeyDifference = Math.abs(obsValue - matchingObject[keys[i + 1]]);

            if (nextKeyDifference < currentKeyDifference) continue;

            return keys[i];
        }
    }
};

var getAgeInMonths = function (dateOfBirth, today) {
    today = C.copyDate(today === undefined ? new Date() : today);

    var birthDate = C.copyDate(dateOfBirth);
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

module.exports = {
    getGrowthIndicators: getGrowthIndicators,
    getAgeInMonths: getAgeInMonths
};

