const motherVisitSchedule = require('./motherVisitSchedule');

const getNextScheduledVisit = function (enrolment) {
    return motherVisitSchedule.getNextScheduledVisit(enrolment);
};