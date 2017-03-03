var anemiaCheck = 'Hb';
var decisions = [];
var decision = {};

const getDecision = function (programEncounter) {

    var observations = programEncounter.observations;
    for (var i = 0; i < programEncounter.observations.length; i++) {
        if (observations[i].concept.name === anemiaCheck) {
            if (observations[i].valueJSON.answer < 7){
                decision = {riskFactorType: 'Moderate and Severe Anemia', message: "Severe Anemia. Please refer to FRU"};
                decisions.push(decision);

            }
            else if (observations[i].valueJSON.answer >= 7 || observations[i].valueJSON.answer <= 11 ){
                decision = {riskFactorType: 'Moderate and Severe Anemia', message: "Moderately Severe Anemia. Needs treatment"};
                decisions.push(decision);
            }
            else {
                decision = {riskFactorType: 'Moderate and Severe Anemia', message: "Hb normal. Please proceed with IFA tablets"};
                decisions.push(decision);
            }
        }
        if (observations[i].concept.name == 'Convulsions') {
            decision = {riskFactorType: 'Convulsions', message: "Continue to monitor. Refer to MO if condition is not under control before 8th month"};
            decisions.push(decision);
        }
    }
    return decisions;
};

module.exports = {
    getDecision: getDecision
};