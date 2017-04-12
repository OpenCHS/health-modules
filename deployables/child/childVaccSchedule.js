const C = require('../common');

var getVaccSchedule = function (programEnrolment) {
    const vaccScheduleItems = [];
    const dateOfBirth = programEnrolment.individual.dateOfBirth;

    //at birth
    addVaccinationSchedule("BCG", 0, 15);
    addVaccinationSchedule("OPV 0", 0, 15);
    addVaccinationSchedule("HEPB 0", 0, 15);
    //at 6 weeks
    addVaccinationSchedule("OPV 1", 42, 42);
    addVaccinationSchedule("Pentavalent 1", 42, 42);
    //at 10 weeks
    addVaccinationSchedule("OPV 2", 70, 70);
    addVaccinationSchedule("Pentavalent 2", 70, 70);
    //at 14 weeks
    addVaccinationSchedule("OPV 3", 98, 98);
    addVaccinationSchedule("Pentavalent 3", 98, 98);
    addVaccinationSchedule("IPV", 98, 98);
    //at 9 months
    addVaccinationSchedule("Measles 1", 274, 274);
    addVaccinationSchedule("JE 1", 274, 274);
    addVaccinationSchedule("Vitamin A 1", 274, 274);
    //between 16 - 24 months
    addVaccinationSchedule("Measles 2", 487, 730);
    addVaccinationSchedule("JE 2", 487, 730);
    addVaccinationSchedule("Vitamin A 2", 487, 730);
    addVaccinationSchedule("OPV Booster", 487, 730);
    addVaccinationSchedule("DPT Booster", 487, 730);
    //Additional Vitamin A doses
    addVaccinationSchedule("Vitamin A 3", 730, 730);
    addVaccinationSchedule("Vitamin A 4", 913, 913);
    addVaccinationSchedule("Vitamin A 5", 1095, 1095);
    addVaccinationSchedule("Vitamin A 6", 1278, 1278);
    addVaccinationSchedule("Vitamin A 7", 1460, 1460);
    addVaccinationSchedule("Vitamin A 8", 1643, 1643);
    addVaccinationSchedule("Vitamin A 9", 1825, 1825);

    return {name: 'Vaccination Schedule', items: vaccScheduleItems};

    function addVaccinationSchedule(nameOfVaccination, dueDateIncrement, maxDateIncrement) {
        const vaccScheduleItem = {
            name: nameOfVaccination,
            dueDate: C.addDays(dateOfBirth, dueDateIncrement),
            maxDate: C.addDays(dateOfBirth, maxDateIncrement)
        };
        vaccScheduleItems.push(vaccScheduleItem);
    }
};

module.exports = {
    getVaccSchedule: getVaccSchedule
};