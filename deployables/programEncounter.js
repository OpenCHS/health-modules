var anemiaCheck = 'Hb';
var decision;

const getDecision = function (programEncounter) {

    var observations = programEncounter.observations;
    for (var i = 0; i < programEncounter.observations.length; i++) {
        if (observations[i].concept.name === anemiaCheck) {
            if (observations[i].valueJSON.answer <= 7)
                decision = "Severe. Please refer to FRU" ;
            else if (observations[i].valueJSON.answer > 7 || observations[i].valueJSON.answer <= 11 )
                decision = "Moderately Severe. Needs treatment" ;
            else decision = "Normal"

        }

    }
    return decision;
};

module.exports = {
    getDecision: getDecision
};