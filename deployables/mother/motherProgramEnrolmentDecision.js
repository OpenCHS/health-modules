const motherVisitSchedule = require('./motherVisitSchedule');

const getNextScheduledVisits = function (enrolment) {
    return motherVisitSchedule.getNextScheduledVisits(enrolment);
};

module.exports = {
    getNextScheduledVisits: getNextScheduledVisits
};