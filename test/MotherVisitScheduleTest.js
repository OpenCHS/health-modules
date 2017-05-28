const expect = require('chai').expect;
const getMotherVisitSchedule = require('../deployables/mother/motherVisitSchedule');
const ProgramEnrolment = require("./Entities").ProgramEnrolment;
const ProgramEncounter = require("./Entities").ProgramEncounter;

describe('Create ANC/PNC Visit Schedule', function () {
    const matchDate = function (date1, date2) {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    };

    const progEnrolment = new ProgramEnrolment('Mother', [new ProgramEncounter('ANC', new Date(2017, 1, 3), 'ANC 1')]);
    progEnrolment.setObservation('Last Menstrual Period', new Date(2017, 0, 3));

    it('Decide next visit details for normal delivery', function(){
        progEnrolment.encounters.push(new ProgramEncounter('ANC', undefined, 'ANC 3'));
        const nextVisit = getMotherVisitSchedule.getNextScheduledVisits(progEnrolment)[0];
        expect(nextVisit.name).is.equal('ANC 4');
        expect(matchDate(nextVisit.dueDate, new Date(2017, 8, 12))).is.equal(true);
    });

    it('Dont create next visit incase of abortion', function(){
        progEnrolment.encounters.push(new ProgramEncounter('Abortion', new Date(2017, 5, 20)));
        const nextVisits = getMotherVisitSchedule.getNextScheduledVisits(progEnrolment);
        expect(nextVisits.length).is.equal(0);
    });

    it('Dont create next visit incase all visits are done', function(){
        progEnrolment.encounters.push({
            encounterType: { name: 'PNC 4'}
        });
        const nextVisits = getMotherVisitSchedule.getNextScheduledVisits(progEnrolment);
        expect(nextVisits.length).is.equal(0);
    });
});


