var C = require('./common');
var weightForAgeScores = require('../deployables/json/weightForAge');
var heightForAgeScores = require('../deployables/json/heightForAge');
var bmiForAgeScores = require('../deployables/json/bmiForAge');

var getGrowthIndicators = function (programEnrolment, today) {
    today = C.copyDate(today === undefined ? new Date() : today);

    var lastEncounter = programEnrolment.encounters.pop();
    var dateOfBirth = programEnrolment.individual.dateOfBirth;
    var weightForAgeZScore;
    var heightForAgeZScore;

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

    var zScoreStatusMappingHeightForAge = {
        'sd3': function () {
            return 'Normal'
        },
        'sd2': function () {
            return 'Normal'
        },
        'sd1': function () {
            return 'Normal'
        },
        'sd0': function () {
            return 'Normal'
        },
        'sd-1': function () {
            return 'Normal'
        },
        'sd-2': function () {
            return 'Stunted'
        },
        'sd-3': function () {
            return 'Severely stunted'
        }
    };

    var zScoreGradeMappingHeightForAge = {
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

    var ZScoreStatusMappingBMIForAge = {
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

    var weightForAgeGenderValues = programEnrolment.individual.gender.name === 'Female' ? weightForAgeScores.female : weightForAgeScores.male;
    var heightForAgeGenderValues = programEnrolment.individual.gender.name === 'Female' ? heightForAgeScores.female : heightForAgeScores.male;
    var bmiForAgeGenderValues = programEnrolment.individual.gender.name === 'Female' ? bmiForAgeScores.female : bmiForAgeScores.male;
    var ageInMonths = C.getAgeInMonths(dateOfBirth, today);

    weightForAgeZScore = lastEncounter === undefined ? getZScore(C.getDataFromObservation(lastEncounter.observations, 'Weight'), weightForAgeGenderValues, ageInMonths) : getZScore(C.getDataFromObservation(lastEncounter.observations, 'Weight'), weightForAgeGenderValues, ageInMonths);

    heightForAgeZScore = lastEncounter === undefined ? getZScore(C.getDataFromObservation(lastEncounter.observations, 'Height'), heightForAgeGenderValues, ageInMonths) : getZScore(C.getDataFromObservation(lastEncounter.observations, 'Height'), heightForAgeGenderValues, ageInMonths);

    var BMI = C.calculateBMI(lastEncounter.observations, ageInMonths);//handle condition when BMI is returned as undefined

    var bmiForAgeZscore = lastEncounter === undefined ? getZScore(BMI, bmiForAgeGenderValues, ageInMonths) : getZScore(BMI, bmiForAgeGenderValues, ageInMonths);

    var gradeForWeightForAge = zScoreGradeMappingWeightForAge[weightForAgeZScore]();
    return [
        {name: 'WeightForAge Z-Score', value: weightForAgeZScore},
        {name: 'WeightForAge Grade', value: gradeForWeightForAge},
        {name: 'WeightForAge Status', value: zScoreStatusMappingWeightForAge[weightForAgeZScore]()},
        {name: 'HeightForAge Z-Score', value: heightForAgeZScore},
        {name: 'HeightForAge Grade', value: zScoreGradeMappingHeightForAge[heightForAgeZScore]()},
        {name: 'HeightForAge Status', value: zScoreStatusMappingHeightForAge[heightForAgeZScore]()},
        {name: 'BMIForAge Status', value: ZScoreStatusMappingBMIForAge[bmiForAgeZscore]()}
    ];

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

module.exports = {
    getGrowthIndicators: getGrowthIndicators
};

