const weightForAgeGirlsBelow5ZScores = require('./anthropometricReference/wfa_girls_0_5_zscores');
const weightForAgeBoysBelow5ZScores = require('./anthropometricReference/wfa_boys_0_5_zscores');
const heightForAgeBoysBelow2ZScores = require('./anthropometricReference/lhfa_boys_0_2_zscores');
const heightForAgeGirlsBelow2ZScores = require('./anthropometricReference/lhfa_girls_0_2_zscores');
const heightForAgeBoysBelow5ZScores = require('./anthropometricReference/lhfa_boys_2_5_zscores');
const heightForAgeGirlsBelow5ZScores = require('./anthropometricReference/lhfa_girls_2_5_zscores');
const weightForHeightGirlsBelow5ZScores = require('./anthropometricReference/wfh_girls_2_5_zscores');
const weightForHeightBoysBelow5ZScores = require('./anthropometricReference/wfh_boys_2_5_zscores');
const weightForHeightGirlsBelow2ZScores = require('./anthropometricReference/wfl_girls_0_2_zscores.json');
const weightForHeightBoysBelow2ZScores = require('./anthropometricReference/wfl_boys_0_2_zscores.json');

const _ = require("lodash");

function chartByAgeForConcept(conceptName, individual) {
    return function (encounter) {
        var obsValue = encounter.getObservationValue(conceptName),
            ageInMonths = individual.getAgeInMonths(encounter.encounterDateTime);
        return obsValue ? {x: ageInMonths, y: obsValue} : null;
    }
}

function chartForConcepts(xAxisConcept, yAxisConcept) {
    return function (encounter) {
        var xValue = encounter.getObservationValue(xAxisConcept),
            yValue = encounter.getObservationValue(yAxisConcept);
        return (xValue && yValue) ? {x: xValue, y: yValue} : null;
    }
}

function createZScoreData(zScoreFile, xAxis) {
    xAxis = xAxis || "Month";
    return _.unzip(_.map(zScoreFile,
        function (item) {
            return _.map(['SD0', 'SD1', 'SD3', 'SD2neg', 'SD3neg'],
                function (key) {
                    return {x: item[xAxis], y: item[key]}
                })
        })
    );
}

function weightForAgeZScores(individual) {
    return individual.isGender('Male') ?
        createZScoreData(weightForAgeBoysBelow5ZScores) :
        createZScoreData(weightForAgeGirlsBelow5ZScores);
}

function heightForAgeZScores(individual) {
    return individual.isGender('Male') ?
        individual.getAgeInMonths() < 25 ?
            createZScoreData(heightForAgeBoysBelow2ZScores) :
            createZScoreData(heightForAgeBoysBelow5ZScores)
        :
        individual.getAgeInMonths() < 25 ?
            createZScoreData(heightForAgeGirlsBelow2ZScores) :
            createZScoreData(heightForAgeGirlsBelow5ZScores);
}

function weightForHeightZScores(individual) {
    return individual.isGender('Male') ?
        individual.getAgeInMonths() < 25 ?
            createZScoreData(weightForHeightBoysBelow2ZScores, "Length") :
            createZScoreData(weightForHeightBoysBelow5ZScores, "Height")
        :
        individual.getAgeInMonths() < 25 ?
            createZScoreData(weightForHeightGirlsBelow2ZScores, "Length") :
            createZScoreData(weightForHeightGirlsBelow5ZScores, "Height");
}

function conceptForAge(enrolment, concept) {
    return _.chain(enrolment.encounters)
        .values()
        .map(chartByAgeForConcept(concept, enrolment.individual))
        .compact()
        .sortBy('x')
        .value();
}

function conceptForConcept(enrolment, xAxisConcept, yAxisConcept) {
    return _.chain(enrolment.encounters)
        .values()
        .map(chartForConcepts(xAxisConcept, yAxisConcept))
        .compact()
        .sortBy('x')
        .value();
}

function weightForAge(enrolment) {
    return conceptForAge(enrolment, "Weight");
}

function heightForAge(enrolment) {
    return conceptForAge(enrolment, "Height");
}

function weightForHeight(enrolment) {
    return conceptForConcept(enrolment, "Height", "Weight");
}

var config = {
    programDashboardButtons: [{
        label: "Growth Chart",
        openOnClick: {
            widgets: [{
                type: "lineChart",
                title: "Weight for age",
                data: function (enrolment) {
                    var data = weightForAgeZScores(enrolment.individual);
                    data.push(weightForAge(enrolment));
                    return data;
                }
            }, {
                type: "lineChart",
                title: "Height for age",
                data: function (enrolment) {
                    var data = heightForAgeZScores(enrolment.individual);
                    data.push(heightForAge(enrolment));
                    return data;
                }
            }, {
                type: "lineChart",
                title: "Weight for Height",
                data: function (enrolment) {
                    var data = weightForHeightZScores(enrolment.individual);
                    data.push(weightForHeight(enrolment));
                    return data;
                }
            }]
        }
    }]
};

module.exports = config;