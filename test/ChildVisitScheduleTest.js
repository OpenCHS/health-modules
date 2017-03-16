var expect = require('chai').expect;
var getchildVisitSchedule = require('../deployables/childVisitSchedule');

describe('Create PNC Visit Schedule for Child', function () {
    var progEnrolment = {
        program: {name: 'Child'},
        observations: [{concept: {name:'Date of Delivery'}, valueJSON: {answer: new Date(2017, 0, 3)}}],
        encounters: [{
            encounterType: { name: 'PNC 1'},
            actualDateTime: new Date(2017, 0, 4)
        }]
    };

    it('Decide next visit details', function(){
        progEnrolment.encounters.push({
            encounterType: { name: 'PNC 2'}
        });
        var nextVisit = getchildVisitSchedule.getNextScheduledVisit(progEnrolment);
        console.log(nextVisit.dueDate);
        expect(nextVisit.visitName).is.equal('PNC 3');
        expect(matchDate(nextVisit.dueDate, new Date(2017, 0, 10))).is.equal(true);
    });

    var matchDate = function (date1, date2) {
        /*console.log(date1.getFullYear());
         console.log(date1.getMonth());
         console.log(date1.getDate());*/
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    };

    it('Dont create next visit incase all visits are done', function(){
        progEnrolment.encounters.push({
            encounterType: { name: 'PNC 4'}
        });
        var nextVisit = getchildVisitSchedule.getNextScheduledVisit(progEnrolment);
        expect(nextVisit).is.equal(null);
    });

});


