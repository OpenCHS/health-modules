const expect = require('chai').expect;
const childProgramConfig = require('../deployables/child/childProgramConfig');
const moment = require('moment');

describe('Child Program Config', function () {
    it("describes dashboard configuration for the child program", function () {
        expect(childProgramConfig).to.be.ok;
    });

    describe("adds a button to the program dashboard", function () {
        var weightAndHeight = function (weight, height) {
                return function (conceptName) {
                    var result = null;
                    switch (conceptName) {
                        case "Weight":
                            result = weight;
                            break;
                        case "Height":
                            result = height;
                    }
                    return result;
                }
            },
            enrolmentStub = {
                individual: {
                    getAgeInMonths: function () {
                        return moment().subtract(3, 'years');
                    },
                    isGender: function (gender) {
                        return gender === 'Female'
                    },
                },
                encounters: {
                    '0': {
                        encounterDatetime: moment().subtract(35, 'months'),
                        getObservationValue: weightAndHeight(14, 110)
                    }
                    ,
                    '1': {
                        encounterDatetime: moment().subtract(24, 'months'),
                        getObservationValue: weightAndHeight(11.2, 98)
                    }
                    ,
                    '2': {
                        encounterDatetime: moment().subtract(18, 'months'),
                        getObservationValue: weightAndHeight(9.8, 90)
                    }
                    ,
                    '3': {
                        encounterDatetime: moment().subtract(2, 'months'),
                        getObservationValue: weightAndHeight(3.5, 60)
                    }
                }
            };


        it("called Growth Chart", function () {
            expect(childProgramConfig.programDashboardButtons[0].label).to.equal('Growth Chart');
        });

        it("that is mapped to a line chart for weight for Age", function () {
            var weightForAgeWidget = childProgramConfig.programDashboardButtons[0].openOnClick.widgets[0];
            expect(weightForAgeWidget.type).to.equal('lineChart');
            var weightForAgeData = weightForAgeWidget.data(enrolmentStub);
            expect(weightForAgeData.length).to.equal(6);
        });

        it("that is mapped to a line chart for height for Age", function () {
            var heightForAgeWidget = childProgramConfig.programDashboardButtons[0].openOnClick.widgets[1];
            expect(heightForAgeWidget.type).to.equal('lineChart');
            var weightForAgeData = heightForAgeWidget.data(enrolmentStub);
            expect(weightForAgeData.length).to.equal(6);
        });

        it("that is mapped to a line chart for weight for height", function () {
            var weightForHeightWidget = childProgramConfig.programDashboardButtons[0].openOnClick.widgets[2];
            expect(weightForHeightWidget.type).to.equal('lineChart');
            var weightForHeightData = weightForHeightWidget.data(enrolmentStub);
            expect(weightForHeightData.length).to.equal(6);
        });
    });
});


