var mother = require('./mother/programEncounterDecision');

const getDecision = function (programEncounter) {
    if (programEncounter.program.name === 'Mother')
        return mother.getDecision(programEncounter);
    return [];
};

module.exports = {
    getDecision: getDecision
};