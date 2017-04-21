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

function conceptForAge(individual, concept) {
    return _.chain(individual.encounters)
        .map(chartByAgeForConcept(concept, individual))
        .compact()
        .sortBy('x')
        .value();
}

function conceptForConcept(individual, xAxisConcept, yAxisConcept) {
    return _.chain(individual.encounters)
        .map(chartForConcepts(xAxisConcept, yAxisConcept))
        .compact()
        .sortBy('x')
        .value();
}

function weightForAge(individual) {
    return conceptForAge(individual, "Weight");
}

function heightForAge(individual) {
    return conceptForAge(individual, "Height");
}

function weightForHeight(individual) {
    return conceptForConcept(individual, "Height", "Weight");
}

var config = {
    programDashboardButtons: [{
        label: "Growth Chart",
        openOnClick: {
            widgets: [{
                type: "lineChart",
                title: "Weight for age",
                data: function (individual) {
                    var data = weightForAgeZScores(individual);
                    data.push(weightForAge(individual));
                    return data;
                }
            }, {
                type: "lineChart",
                title: "Height for age",
                data: function (individual) {
                    var data = heightForAgeZScores(individual);
                    data.push(heightForAge(individual));
                    return data;
                }
            }, {
                type: "lineChart",
                title: "Weight for Height",
                data: function (individual) {
                    var data = weightForHeightZScores(individual);
                    data.push(weightForHeight(individual));
                    return data;
                }
            }]
        }
    }]
};

module.exports = config;