var expect = require('chai').expect;
var assert = require('chai').assert;
var getVaccSchedule = require('../deployables/childVaccSchedule');

describe('Create Child Vaccincation Schedule', function () {
    var date = new Date(2017, 3, 10);
    var progEnrolment = {
        individual: {
            gender: {name: 'Female'},
            dateofbirth: date
        }
    };

    it('Get Vacc Schedule for a new born', function () {

        var vaccSchedules = getVaccSchedule.getVaccSchedule(progEnrolment);
        var vaccNames = vaccSchedules.map(function (vaccSchedule) {
            return vaccSchedule.vaccName;
        });
        expect(vaccNames.indexOf("BCG")).is.not.equal(-1);
        expect(vaccNames.indexOf("OPV0")).is.not.equal(-1);
        expect(vaccNames.indexOf("OPV1")).is.not.equal(-1);
    });

    it('Check vacc date for OPV3 vaccination', function () {
        var vaccSchedules = getVaccSchedule.getVaccSchedule(progEnrolment);
        var OPV3 = vaccSchedules[7];
        assert.equal(true, matchDate(OPV3.dueDate, new Date(2017, 6, 17)), OPV3.dueDate);
    });

    var matchDate = function (date1, date2) {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    }
});

