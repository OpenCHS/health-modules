class RuleContext {
    constructor() {
        this.questionAnswers = new Map();
    }

    getAnswerFor(questionName) {
        return this.questionAnswers.get(questionName)
    }

    set(key, value) {
        this.questionAnswers.set(key, value);
    }
}

export default RuleContext;