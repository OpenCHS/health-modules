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
                        case "Weight": result = weight;
                        case "Height": result = height;
                    }
                    return result;
                }
            },
            individualStub = {
                getAgeInMonths: function () {
                    return moment().subtract(3, 'years');
                },
                isGender: function (gender) {
                    return gender === 'Female'
                },
                encounters: [
                    {
                        encounterDatetime: moment().subtract(35, 'months'),
                        getObservationValue: weightAndHeight(3.5, 14)
                    },
                    {
                        encounterDatetime: moment().subtract(24, 'months'),
                        getObservationValue: weightAndHeight(9.8, 12)
                    },
                    {
                        encounterDatetime: moment().subtract(18, 'months'),
                        getObservationValue: weightAndHeight(11.2, 10)
                    },
                    {
                        encounterDatetime: moment().subtract(2, 'months'),
                        getObservationValue: weightAndHeight(14, 9)
                    }
                ]
            };


        it("called Growth Chart", function () {
            expect(childProgramConfig.programDashboardButtons[0].label).to.equal('Growth Chart');
        });

        it("that is mapped to a line chart for weight for Age", function () {
            var weightForAgeWidget = childProgramConfig.programDashboardButtons[0].openOnClick.widgets[0];
            expect(weightForAgeWidget.type).to.equal('lineChart');
            var weightForAgeData = weightForAgeWidget.data(individualStub);
            expect(weightForAgeData.length).to.equal(6);
        });

        it("that is mapped to a line chart for height for Age", function () {
            var heightForAgeWidget = childProgramConfig.programDashboardButtons[0].openOnClick.widgets[1];
            expect(heightForAgeWidget.type).to.equal('lineChart');
            var weightForAgeData = heightForAgeWidget.data(individualStub);
            expect(weightForAgeData.length).to.equal(6);
        });

        it("that is mapped to a line chart for weight for height", function () {
            var heightForAgeWidget = childProgramConfig.programDashboardButtons[0].openOnClick.widgets[1];
            expect(heightForAgeWidget.type).to.equal('lineChart');
            var weightForAgeData = heightForAgeWidget.data(individualStub);
            expect(weightForAgeData.length).to.equal(6);
        });
    });
});


