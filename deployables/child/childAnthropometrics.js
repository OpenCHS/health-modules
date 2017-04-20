var C = require('../common');
var weightForAgeScores = require('../json/weightForAge');
var heightForAgeScores = require('../json/heightForAge');
var weightForHeightScores = require('../json/weightForHeight');
var bmiForAgeScores = require('../json/bmiForAge');

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
var getDecisions = function (observationsHolder, individual, today) {
    today = C.copyDate(today === undefined ? new Date() : today);

    var dateOfBirth = individual.dateOfBirth;

    var weightForAgeGenderValues = individual.gender.name === 'Female' ? weightForAgeScores.female : weightForAgeScores.male;
    var heightForAgeGenderValues = individual.gender.name === 'Female' ? heightForAgeScores.female : heightForAgeScores.male;
    var weightForHeightGenderValues = individual.gender.name === 'Female' ? weightForHeightScores.female : weightForHeightScores.male;
    var bmiForAgeGenderValues = individual.gender.name === 'Female' ? bmiForAgeScores.female : bmiForAgeScores.male;
    var ageInMonths = C.getAgeInMonths(dateOfBirth, today);

    if (ageInMonths > 60 || !observationsHolder.observationExists('Height') || !observationsHolder.observationExists('Weight')) return [];
    else {
        const weight = observationsHolder.getObservationValue('Weight');
        const height = observationsHolder.getObservationValue('Height');
        const length = C.getMatchingKey(height, weightForHeightGenderValues);

        const weightForAgeZScore = getZScore(weightForAgeGenderValues, 'month', ageInMonths, weight);
        const heightForAgeZScore = getZScore(heightForAgeGenderValues, 'month', ageInMonths, height);
        const weightForHeightZScore = getZScore(weightForHeightGenderValues, 'length', length, weight);
        const bmiForAgeZscore = ageInMonths > 24 ? getZScore(bmiForAgeGenderValues, 'month', ageInMonths, C.calculateBMI(weight, height, ageInMonths)) : null;
        const gradeForWeightForAge = zScoreGradeMappingWeightForAge[weightForAgeZScore];
        const bmiForAgeStatus = bmiForAgeZscore === null ? null : ZScoreStatusMappingBMIForAge[bmiForAgeZscore];

        const decisions = [];
        decisions.push({name: 'Weight for age z-score', value: weightForAgeZScore});
        decisions.push({name: 'Weight for age grade', value: gradeForWeightForAge});
        decisions.push({name: 'Weight for age status', value: zScoreStatusMappingWeightForAge[weightForAgeZScore]});
        decisions.push({name: 'Height for age z-score', value: heightForAgeZScore});
        decisions.push({name: 'Height for age grade', value: zScoreGradeMappingHeightForAge[heightForAgeZScore]});
        decisions.push({name: 'Height for age status', value: zScoreStatusMappingHeightForAge[heightForAgeZScore]});
        decisions.push({name: 'Weight for height z-score', value: weightForHeightZScore});
        decisions.push({name: 'Weight for height status', value: zScoreStatusMappingWeightForHeight[weightForHeightZScore]});
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
    getDecisions: getDecisions
};