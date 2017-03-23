var C = require('./common');
var weightForAgeScores = require('../deployables/json/weightForAge');
var heightForAgeScores = require('../deployables/json/heightForAge');
var weightForHeightScores = require('../deployables/json/weightForHeight');
var bmiForAgeScores = require('../deployables/json/bmiForAge');

var zScoreGradeMappingWeightForAge = {
    'sd0': 1,
    'sd-1': 1,
    'sd-2': 2,
    'sd-3': 3
};
var zScoreStatusMappingWeightForAge = {
    'sd0': 'Normal',
    'sd-1': 'Normal',
    'sd-2': 'Underweight',
    'sd-3': 'Severely Underweight'
};
var zScoreStatusMappingHeightForAge = {
    'sd3': 'Normal',
    'sd2': 'Normal',
    'sd1': 'Normal',
    'sd0': 'Normal',
    'sd-1': 'Normal',
    'sd-2': 'Stunted',
    'sd-3': 'Severely stunted'
};
var zScoreGradeMappingHeightForAge = {
    'sd3': 1,
    'sd2': 1,
    'sd1': 1,
    'sd0': 1,
    'sd-1': 1,
    'sd-2': 2,
    'sd-3': 3
};
var ZScoreStatusMappingBMIForAge = {
    'sd3': 'Obese',
    'sd2': 'Overweight',
    'sd1': 'Possible risk of overweight',
    'sd0': 'Normal',
    'sd-1': 'Normal',
    'sd-2': 'Wasted',
    'sd-3': 'Severely wasted'
};

/* Todo
 1. null checks
 2. Refactor for - Height will not be calculated everytime. Need to get height from the last encounter that has it
 Same might be true for weight
 */
var getGrowthIndicators = function (programEnrolment, today) {
    today = C.copyDate(today === undefined ? new Date() : today);

    var workingObservations;
    if (programEnrolment.encounters === undefined || programEnrolment.encounters.length === 0)
        workingObservations = programEnrolment.observations;
    else
        workingObservations = programEnrolment.encounters[programEnrolment.encounters.length - 1].observations;

    var dateOfBirth = programEnrolment.individual.dateOfBirth;

    var weightForAgeGenderValues = programEnrolment.individual.gender.name === 'Female' ? weightForAgeScores.female : weightForAgeScores.male;
    var heightForAgeGenderValues = programEnrolment.individual.gender.name === 'Female' ? heightForAgeScores.female : heightForAgeScores.male;
    var weightForHeightGenderValues = programEnrolment.individual.gender.name === 'Female' ? weightForHeightScores.female : weightForHeightScores.male;
    var bmiForAgeGenderValues = programEnrolment.individual.gender.name === 'Female' ? bmiForAgeScores.female : bmiForAgeScores.male;
    var ageInMonths = C.getAgeInMonths(dateOfBirth, today);
    var length = C.getMatchingKey(C.getDataFromObservation(workingObservations, 'Height'), weightForHeightGenderValues);
    console.log(length);

    if (ageInMonths > 60) return null;
    else {
        var weightForAgeZScore = getZScore(weightForAgeGenderValues, 'month', ageInMonths, C.getDataFromObservation(workingObservations, 'Weight'));
        var heightForAgeZScore = getZScore(heightForAgeGenderValues, 'month', ageInMonths, C.getDataFromObservation(workingObservations, 'Height'));
        var weightForHeightZScore = getZScore(weightForHeightGenderValues, 'length', length, C.getDataFromObservation(workingObservations, 'Weight'));
        var bmiForAgeZscore = ageInMonths > 24 ? getZScore(bmiForAgeGenderValues, 'month', ageInMonths, C.calculateBMI(workingObservations, ageInMonths)) : null;
        var gradeForWeightForAge = zScoreGradeMappingWeightForAge[weightForAgeZScore];
        var bmiForAgeStatus = bmiForAgeZscore === null ? null : ZScoreStatusMappingBMIForAge[bmiForAgeZscore];

        var decisions = [];
        decisions.push({name: 'WeightForAge Z-Score', value: weightForAgeZScore});
        decisions.push({name: 'WeightForAge Grade', value: gradeForWeightForAge});
        decisions.push({name: 'WeightForAge Status', value: zScoreStatusMappingWeightForAge[weightForAgeZScore]});
        decisions.push({name: 'HeightForAge Z-Score', value: heightForAgeZScore});
        decisions.push({name: 'HeightForAge Grade', value: zScoreGradeMappingHeightForAge[heightForAgeZScore]});
        decisions.push({name: 'HeightForAge Status', value: zScoreStatusMappingHeightForAge[heightForAgeZScore]});
        decisions.push({name: 'WeightForHeight Z-Score', value: weightForHeightZScore});
        if (bmiForAgeStatus === null) return decisions;
        else {
            decisions.push({name: 'BMIForAge Status', value: bmiForAgeStatus});
            return decisions;
        }
    }

    function getZScore(masterTable, key, value, obsValue) {
        var matchingRow = masterTable.find(function (masterRow) {
            return masterRow[key] === value;
        });

        var keys = Object.keys(matchingRow);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === 'month' || keys[i] === 'length') continue;

            var currentKeyDifference = Math.abs(obsValue - matchingRow[keys[i]]);
            var nextKeyDifference = Math.abs(obsValue - matchingRow[keys[i + 1]]);

            if (nextKeyDifference < currentKeyDifference) continue;

            return keys[i];
        }
    }
};

module.exports = {
    getGrowthIndicators: getGrowthIndicators
};

