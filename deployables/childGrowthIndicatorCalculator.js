/*
- from date of birth, get corresponding month
- if programEncounter is empty, get height and weight from programEnrolment else take from last encounter
 */

var C = require('./common');
var femaleScores = require('../deployables/json/weightForAge');

var getGrowthIndicators = function (programEnrolment) {

    var lastEncounter = programEnrolment.encounters.pop();
    var observations = programEnrolment.observations;
    var dateOfBirth = programEnrolment.individual.dateOfBirth;
    var ageInMonths = getAgeInMonths(dateOfBirth);
    var weight;

    if(programEnrolment.individual.Gender != undefined && programEnrolment.individual.Gender.name == 'Female'){
        if(lastEncounter != undefined ){
            weight = C.getDataFromObservation(lastEncounter.observations, 'Weight');
            return getZScoreWeightForAge(weight, femaleScores, ageInMonths);
        }
        else {
            weight = C.getDataFromObservation(observations, 'Weight');
            return getZScoreWeightForAge(weight, femaleScores, ageInMonths);
        }
    }
    else return null; //this will change when we have male


    function getZScoreWeightForAge(weight, masterData, age){
        return masterData.find(function (obs) {
            return obs.month === age;
        });
    }

    function getAgeInMonths(dateOfBirth){
        var birthDate = C.copyDate(dateOfBirth);
        var today = C.copyDate(new Date());
        var year1=birthDate.getFullYear();
        var year2=today.getFullYear();
        var month1=birthDate.getMonth();
        var month2=today.getMonth();
        if(month1===0){ //Have to take into account
            month1++;
            month2++;
        }
        var numberOfMonths = numberOfMonths = (year2 - year1) * 12 + (month2 - month1);
        return (numberOfMonths);
    }

};

module.exports = {
    getGrowthIndicators: getGrowthIndicators
};

