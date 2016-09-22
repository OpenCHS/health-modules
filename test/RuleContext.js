function RuleContext() {
    this.questionAnswers = new Map();

    this.getAnswerFor = function(questionName) {
        return this.questionAnswers.get(questionName);
    };

    this.getDurationInYears = function(questionName) {
        return this.questionAnswers.get(questionName);
    };

    this.set = function(key, value) {
        this.questionAnswers.set(key, value);
        return this;
    }
}
module.exports = RuleContext;