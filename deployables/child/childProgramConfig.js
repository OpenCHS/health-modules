const weightForAgeGirlsBelow5ZScores = require('./anthropometricReference/wfa_girls_0_5_zscores');
const weightForAgeBoysBelow5ZScores = require('./anthropometricReference/wfa_boys_0_5_zscores');
const heightForAgeBoysBelow2ZScores = require('./anthropometricReference/lhfa_boys_0_2_zscores');
const heightForAgeGirlsBelow2ZScores = require('./anthropometricReference/lhfa_girls_0_2_zscores');
const heightForAgeBoysBelow5ZScores = require('./anthropometricReference/lhfa_boys_2_5_zscores');
const heightForAgeGirlsBelow5ZScores = require('./anthropometricReference/lhfa_girls_2_5_zscores');
const weightForHeightGirlsBelow5ZScores = require('./anthropometricReference/wfh_girls_2_5_zscores');
const weightForHeightBoysBelow5ZScores = require('./anthropometricReference/wfh_boys_2_5_zscores');

const _ = require("lodash");

function chartByAgeForConcept(conceptName, individual) {
    return function (encounter) {
        var obsValue = encounter.getObservationValue(conceptName);
        return obsValue ? {
                x: individual.getAgeInMonths(encounter.encounterDateTime),
                y: obsValue
            }
            : null;
    }
}

function chartForConcepts(xAxisConcept, yAxisConcept) {
    return function (encounter) {
        var xValue = encounter.getObservationValue(xAxisConcept),
            yValue = encounter.getObservationValue(yAxisConcept);
        return (xValue && yValue) ? {
                x: xValue,
                y: yValue
            }
            : null;
    }
}

function createZScoreData(zScoreFile, xAxis) {
    xAxis = xAxis || "Month";
    return _.unzip(_.map(zScoreFile, function (item) {
        return [
            {x: item[xAxis], y: item.SD0},
            {x: item[xAxis], y: item.SD1},
            {x: item[xAxis], y: item.SD3},
            {x: item[xAxis], y: item.SD2neg},
            {x: item[xAxis], y: item.SD3neg}
        ]
    }));
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
        createZScoreData(weightForHeightBoysBelow5ZScores) :
        createZScoreData(weightForHeightGirlsBelow5ZScores);
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
    return conceptForConcept(individual, "Weight", "Height");
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