class RuleContext {
    constructor() {
        this.questionAnswers = new Map();
    }

    getAnswerFor(questionName) {
        return this.questionAnswers.get(questionName);
    }

    getDurationInYears(questionName) {
        return this.questionAnswers.get(questionName);
    }

    set(key, value) {
        this.questionAnswers.set(key, value);
        return this;
    }
}

export default RuleContext;