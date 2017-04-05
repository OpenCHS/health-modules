CREATE OR REPLACE FUNCTION setupChildProgramEncounterForms()
  RETURNS VOID AS $$
  DECLARE foo record;
  DECLARE formId BIGINT;
  DECLARE formElementGroupId BIGINT;
  DECLARE metaDataVersionName VARCHAR(50) := 'V0_6__childProgramEncounterForm';
    DECLARE programId BIGINT;
BEGIN
    raise notice 'Starting %...', metaDataVersionName;
    SELECT id INTO foo from openchs.health_metadata_version where name = metaDataVersionName;
    IF foo is NULL THEN
      INSERT INTO openchs.health_metadata_version (name) VALUES (metaDataVersionName);
    ELSE
      raise notice '% already run.', metaDataVersionName;
      RETURN;
    END IF;

    SELECT id into programId from openchs.program where name = 'Child';
    SELECT openchs.create_form('Default', 'e09dddeb-ed72-40c4-ae8d-112d8893f18b', 'ProgramEncounter', programId, '11c85299-9262-4015-9344-4c00958bad29', 'd64b99db-996d-41f9-85c7-0dde5c317f6f') INTO formId;
    SELECT openchs.create_form_element_group('Anthropometrics', '09039df3-0262-4219-8256-58e05def2bdc', 1::SMALLINT, formId) INTO formElementGroupId;
    SELECT openchs.create_form_element('Height', 'ea2b0a11-f25d-4023-832a-a00f1bee6afa', 1::SMALLINT, TRUE, formElementGroupId, 0, '[]') INTO foo;
    SELECT openchs.create_form_element('Weight', '12939714-6fe2-4c55-bf68-2b536c014b86', 2::SMALLINT, TRUE, formElementGroupId, 0, '[]') INTO foo;
    
    EXCEPTION WHEN others THEN
    raise notice '% %', SQLERRM, SQLSTATE;
END;
$$ LANGUAGE plpgsql;

SELECT openchs.setupChildProgramEncounterForms();