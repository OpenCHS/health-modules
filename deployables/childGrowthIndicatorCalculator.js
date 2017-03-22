var C = require('./common');
var weightForAgeScores = require('../deployables/json/weightForAge');
var heightForAgeScores = require('../deployables/json/heightForAge');
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
1. handle BMI calculation for infants upto 13 weeks
2. null checks
3. Dont add to returning array if value is null
4. Handle if age > 5 yrs
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
    var bmiForAgeGenderValues = programEnrolment.individual.gender.name === 'Female' ? bmiForAgeScores.female : bmiForAgeScores.male;
    var ageInMonths = C.getAgeInMonths(dateOfBirth, today);

    var weightForAgeZScore = getZScore(C.getDataFromObservation(workingObservations, 'Weight'), weightForAgeGenderValues, ageInMonths);
    var heightForAgeZScore = getZScore(C.getDataFromObservation(workingObservations, 'Height'), heightForAgeGenderValues, ageInMonths);
    var BMI = C.calculateBMI(workingObservations, ageInMonths);//handle condition when BMI is returned as undefined
    var bmiForAgeZscore = getZScore(BMI, bmiForAgeGenderValues, ageInMonths);

    var gradeForWeightForAge = zScoreGradeMappingWeightForAge[weightForAgeZScore];
    return [
        {name: 'WeightForAge Z-Score', value: weightForAgeZScore},
        {name: 'WeightForAge Grade', value: gradeForWeightForAge},
        {name: 'WeightForAge Status', value: zScoreStatusMappingWeightForAge[weightForAgeZScore]},
        {name: 'HeightForAge Z-Score', value: heightForAgeZScore},
        {name: 'HeightForAge Grade', value: zScoreGradeMappingHeightForAge[heightForAgeZScore]},
        {name: 'HeightForAge Status', value: zScoreStatusMappingHeightForAge[heightForAgeZScore]},
        {name: 'BMIForAge Status', value: ZScoreStatusMappingBMIForAge[bmiForAgeZscore]}
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

