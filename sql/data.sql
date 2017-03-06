-- run it from the current directory
\i encounterForm.sql;
\i individualRegistrationForm.sql;
\i programEnrolmentForms.sql;
SELECT setupEncounterForm();
SELECT setupIndividualRegistrationForm();
SELECT setupProgramEnrolmentForms();
\i villages.sql;