var expect = require('chai').expect;
var getMotherVisitSchedule = require('../deployables/mother/motherVisitSchedule');

describe('Create ANC/PNC Visit Schedule', function () {
    var progEnrolment = {
        program: {name: 'Mother'},
        observations: [{concept: {name:'Last Menstrual Period'}, valueJSON: {answer: new Date(2017, 0, 3)}}],
        encounters: [{
            encounterType: { name: 'ANC 1'},
            actualDateTime: new Date(2017, 1, 3)
        }]
    };

    it('Decide next visit details for normal delivery', function(){
        progEnrolment.encounters.push({
            encounterType: { name: 'ANC 3'}
        });
        var nextVisit = getMotherVisitSchedule.getNextScheduledVisit(progEnrolment);
        console.log(nextVisit.dueDate);
        expect(nextVisit.visitName).is.equal('ANC 4');
        expect(matchDate(nextVisit.dueDate, new Date(2017, 8, 12))).is.equal(true);
    });

    var matchDate = function (date1, date2) {
        /*console.log(date1.getFullYear());
        console.log(date1.getMonth());
        console.log(date1.getDate());*/
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    };

    it('Dont create next visit incase of abortion', function(){
        progEnrolment.encounters.push({
            encounterType: { name: 'Abortion'},
            actualDateTime: new Date(2017, 5, 20)
        });
        var nextVisit = getMotherVisitSchedule.getNextScheduledVisit(progEnrolment);
        expect(nextVisit).is.equal(null);
    });

    it('Dont create next visit incase all visits are done', function(){
        progEnrolment.encounters.push({
            encounterType: { name: 'PNC 4'}
        });
        var nextVisit = getMotherVisitSchedule.getNextScheduledVisit(progEnrolment);
        expect(nextVisit).is.equal(null);
    });

});


