function ObservationRule(conceptName, {allowedOccurrences = -1, validFrom = 0, validTill = Number.MAX_SAFE_INTEGER, validityBasedOn = 'enrolmentDate'}) {
    this.conceptName = conceptName;
    this.allowedOccurrences = allowedOccurrences;
    this.validityBasedOn = validityBasedOn;
    this.validFrom = validFrom;
    this.validTill = validTill;
}

let observationRules = [];
addANCRule(new ObservationRule("Breast Examination - Nipple", {allowedOccurrences: 1, validTill: 12}));
addANCRule(new ObservationRule("Fundal Height", {}));
addANCRule(new ObservationRule("Fundal height from pubic symphysis", {}));
addANCRule(new ObservationRule("Fetal movements", {validFrom: 21}));
addANCRule(new ObservationRule("Fetal Presentation", {validFrom: 29}));
addANCRule(new ObservationRule("Fetal Heart Sound", {validFrom: 29}));
addANCRule(new ObservationRule("Hb", {allowedOccurrences: 1}));
addANCRule(new ObservationRule("Blood Sugar", {allowedOccurrences: 1}));
addANCRule(new ObservationRule("VDRL", {allowedOccurrences: 1}));
addANCRule(new ObservationRule("HIV/AIDS", {allowedOccurrences: 1}));
addANCRule(new ObservationRule("HbsAg", {allowedOccurrences: 1}));
addANCRule(new ObservationRule("Bile Salts", {allowedOccurrences: 1}));
addANCRule(new ObservationRule("Bile Pigments", {allowedOccurrences: 1}));
addANCRule(new ObservationRule("Sickling Test", {allowedOccurrences: 1}));
addANCRule(new ObservationRule("Hb Electrophoresis", {allowedOccurrences: 1}));

function addANCRule(observationRule) {
    observationRule.validityBasedOn = "Last Menstrual Period";
    observationRules.push(observationRule);
}

module.exports =  observationRules;