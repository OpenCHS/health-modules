const getDecision = function (programEncounter) {
    function checkForAnemia(programEncounter, decisions) {
        var observations = programEncounter.observations;
        for (var i = 0; i < programEncounter.observations.length; i++) {
            if (observations[i].concept.name === 'Hb') {
                if (observations[i].valueJSON.answer < 7){
                    decisions.push({riskFactorType: 'Moderate and Severe Anemia', message: "Severe Anemia. Please refer to FRU"});
                } else if (observations[i].valueJSON.answer >= 7 || observations[i].valueJSON.answer <= 11 ){
                    decisions.push({riskFactorType: 'Moderate and Severe Anemia', message: "Moderately Severe Anemia. Needs treatment"});
                } else {
                    decisions.push({riskFactorType: 'Moderate and Severe Anemia', message: "Hb normal. Please proceed with IFA tablets"});
                }
            }
        }
        return decisions;
    }

    function checkForConvulsions(programEncounter, decisions) {
        var observations = programEncounter.observations;
        for (var i = 0; i < programEncounter.observations.length; i++) {
            if (observations[i].concept.name === 'Convulsions' && observations[i].valueJSON.answer) {
                decisions.push({riskFactorType: 'Convulsions', message: "Continue to monitor. Refer to MO if condition is not under control before 8th month"});
            }
        }
        return decisions;
    }

    var decisions = checkForAnemia(programEncounter, []);
    return checkForConvulsions(programEncounter, decisions);
};

module.exports = {
    getDecision: getDecision
};
