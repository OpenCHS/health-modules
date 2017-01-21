function RuleContext() {
    this.questionAnswers = new Map();

    this.getObservationValue = function (questionName) {
        return this.questionAnswers.get(questionName);
    };

    this.getDurationInYears = function (questionName) {
        return this.questionAnswers.get(questionName);
    };

    this.set = function (key, value) {
        this.questionAnswers.set(key, value);
        return this;
    };

    this.getDurationInMonths = function (questionName) {
        const duration = this.questionAnswers.get(questionName);
        return duration.inMonths;
    }
}
module.exports = RuleContext;