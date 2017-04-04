var getNextScheduledVisits = require('./motherVisitSchedule').getNextScheduledVisits;

const getDecisions = function (programEncounter) {
    function checkForAnemia(programEncounter, decisions) {
        var observations = programEncounter.observations;
        for (var i = 0; i < programEncounter.observations.length; i++) {
            if (observations[i].concept.name === 'Hb') {
                if (observations[i].valueJSON.answer < 7) {
                    decisions.push({name: 'Referral', value: "Severe Anemia. Refer to FRU"});
                    decisions.push({name: 'Pregnancy Risk', value: 'Moderate and Severe Anemia'});
                } else if (observations[i].valueJSON.answer >= 7 || observations[i].valueJSON.answer <= 11) {
                    decisions.push({name: 'Pregnancy Risk', value: 'Moderate and Severe Anemia, requiring treatment'});
                } else {
                    decisions.push({name: 'Pregnancy Risk', value: "Hb normal. Proceed with IFA tablets"});
                }
            }
        }
        return decisions;
    }

    function checkForConvulsions(programEncounter, decisions) {
        var observations = programEncounter.observations;
        for (var i = 0; i < programEncounter.observations.length; i++) {
            if (observations[i].concept.name === 'Convulsions' && observations[i].valueJSON.answer) {
                decisions.push({name: 'Pregnancy Risk', value: "Has convulsions. Continue to monitor. Refer to MO if condition not under control before 8th month"});
            }
        }
        return decisions;
    }

    var decisions = checkForAnemia(programEncounter, []);
    return checkForConvulsions(programEncounter, decisions);
};

module.exports = {
    getDecisions: getDecisions,
    getNextScheduledVisits: getNextScheduledVisits
};
