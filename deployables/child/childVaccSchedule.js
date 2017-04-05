var C = require('../common');

var getVaccSchedule = function (programEnrolment) {
    var vaccSchedules = [];
    var dateOfBirth = programEnrolment.individual.dateOfBirth;

    //at birth
    addVaccinationSchedule("BCG", 0, 15);
    addVaccinationSchedule("OPV0", 0, 15);
    addVaccinationSchedule("HEPB0", 0, 15);
    //at 6 weeks
    addVaccinationSchedule("OPV1", 42, 42);
    addVaccinationSchedule("Pentavalent1", 42, 42);
    //at 10 weeks
    addVaccinationSchedule("OPV2", 70, 70);
    addVaccinationSchedule("Pentavalent2", 70, 70);
    //at 14 weeks
    addVaccinationSchedule("OPV3", 98, 98);
    addVaccinationSchedule("Pentavalent3", 98, 98);
    addVaccinationSchedule("IPV", 98, 98);
    //at 9 months
    addVaccinationSchedule("Measles 1", 274, 274);
    addVaccinationSchedule("JE 1", 274, 274);
    addVaccinationSchedule("VitaminA 1", 274, 274);
    //between 16 - 24 months
    addVaccinationSchedule("Measles 2", 487, 730);
    addVaccinationSchedule("JE 2", 487, 730);
    addVaccinationSchedule("VitaminA 2", 487, 730);
    addVaccinationSchedule("OPV Booster", 487, 730);
    addVaccinationSchedule("DPT Booster", 487, 730);
    //Additional Vitamin A doses
    addVaccinationSchedule("VitaminA 3", 730, 730);
    addVaccinationSchedule("VitaminA 4", 913, 913);
    addVaccinationSchedule("VitaminA 5", 1095, 1095);
    addVaccinationSchedule("VitaminA 6", 1278, 1278);
    addVaccinationSchedule("VitaminA 7", 1460, 1460);
    addVaccinationSchedule("VitaminA 8", 1643, 1643);
    addVaccinationSchedule("VitaminA 9", 1825, 1825);

    return vaccSchedules;

    function addVaccinationSchedule(nameOfVaccination, dueDateIncrement, maxDateIncrement) {
        var vaccSchedule = {
            vaccName: nameOfVaccination,
            dueDate: C.addDays(dateOfBirth, dueDateIncrement),
            maxDate: C.addDays(dateOfBirth, maxDateIncrement)
        };
        vaccSchedules.push(vaccSchedule);
    }
};

module.exports = {
    getVaccSchedule: getVaccSchedule
};