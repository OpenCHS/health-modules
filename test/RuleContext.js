function RuleContext() {
    this.questionAnswers = new Map();

    this.getAnswerFor = function (questionName) {
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
        var duration = this.questionAnswers.get(questionName);
        return duration.inMonths;
    }
}
module.exports = RuleContext;