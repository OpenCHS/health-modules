function C() {
    this.addDays = function(date, numberOfDays) {
        var copied = this.copyDate(date);
        copied.setDate(copied.getDate() + numberOfDays);
        return copied;
    };

    this.copyDate = function(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
}

module.exports = new C();