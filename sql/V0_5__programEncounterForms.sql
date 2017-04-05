CREATE OR REPLACE FUNCTION setupProgramEncounterForms()
  RETURNS VOID AS $$
  DECLARE programId BIGINT;
  DECLARE formId BIGINT;
  DECLARE foo RECORD;
  DECLARE formElementGroupId BIGINT;
  DECLARE metaDataVersionName VARCHAR(50) := 'V0_5__programEncounterForms';
BEGIN
    raise notice 'Starting %...', metaDataVersionName;
    SELECT id INTO foo from openchs.health_metadata_version where name = metaDataVersionName;
    IF foo is NULL THEN
      INSERT INTO openchs.health_metadata_version (name) VALUES (metaDataVersionName);
    ELSE
      raise notice '% already run.', metaDataVersionName;
      RETURN;
    END IF;

    SELECT id into programId from openchs.program where name = 'Mother';

    -- ANC --
    SELECT openchs.create_form('ANC', '3a95e9b0-731a-4714-ae7c-10e1d03cebfe', 'ProgramEncounter', programId, '0e41fbb3-8892-4291-bde5-c94e9ed0dba1', '775e1f8d-bda9-4210-a67a-acf6b478df63') INTO formId;
  
    SELECT openchs.create_form_element_group('Physical Examination', '36debb83-db66-4da1-88c7-23c0dfc47649', 1::SMALLINT, formId) INTO formElementGroupId;
    SELECT openchs.create_form_element('Pedal Edema', '32bed768-4074-45c4-92a6-4bc27f43bbdc', 1::SMALLINT, FALSE, formElementGroupId, 0, '[{"key": "TrueValue", "value": "Present"}, {"key": "FalseValue", "value": "Absent"}]') INTO foo;
    SELECT openchs.create_form_element('Pallor', '6b5f0898-6ea3-4395-91e2-6e415cada5ff', 2::SMALLINT, FALSE, formElementGroupId, 0, '[{"key": "TrueValue", "value": "Present"}, {"key": "FalseValue", "value": "Absent"}]') INTO foo;
    SELECT openchs.create_form_element_for_concept('Fits/Convulsion', 'b0f2fead-9d1d-4bef-bb24-4db2aa94f5e0', 3::SMALLINT, FALSE, formElementGroupId, '[{"key": "TrueValue", "value": "Present"}, {"key": "FalseValue", "value": "Absent"}]', '2ba2150f-30d2-4f20-b296-ca2b431b138f', 'Boolean') INTO foo;
    SELECT openchs.create_form_element_for_concept('Jaundice', 'a9a50a04-6e62-4398-b0ed-1039f82fe323', 4::SMALLINT, FALSE, formElementGroupId, '[{"key": "TrueValue", "value": "Present"}, {"key": "FalseValue", "value": "Absent"}]', '61585315-6414-4c52-9ccb-b273987b16ae', 'Boolean') INTO foo;
    SELECT openchs.create_form_element_for_concept('No risk symptoms observed', '330a0b93-91ed-4ef9-91bc-d7d5613ffec1', 5::SMALLINT, FALSE, formElementGroupId, '[{"key": "TrueValue", "value": "Present"}, {"key": "FalseValue", "value": "Absent"}]', 'ffff415f-941d-42c5-8685-16d4a2a088a4', 'Boolean') INTO foo;
    SELECT openchs.create_form_element('Weight', '35868c08-7c14-4c1f-beed-b0a4c4ea11f8', 6::SMALLINT, FALSE, formElementGroupId, 0, '[]') INTO foo;
    SELECT openchs.create_form_element_for_concept('Height', '695fdfda-4c0d-44b2-8a46-62d79fe966b0', 7::SMALLINT, FALSE, formElementGroupId, '[]', 'a330712c-6e74-4a13-a2e6-08bb843c6886', 'Numeric') INTO foo;
    SELECT openchs.create_form_element_for_concept_with_answers('Foetal presentation', '689a1fc1-08cc-442b-9266-b7e147e7c8fa', 8::SMALLINT, FALSE, formElementGroupId, '[{"key": "Select", "value": "Single"}]', '282890e0-6e9c-4230-b8ae-2f0b8756dbc0', '[{"name": "Cephalic", "uuid": "31980541-b3f9-4c0d-b721-4fda7e48dcf8", "answerOrder": 1}, {"name": "Breach", "uuid": "840093be-b6fc-4549-be11-25c806ac2e52", "answerOrder": 2}, {"name": "Transverse", "uuid": "2a1f6278-b7c9-4230-9d80-d0f424c6a6a0", "answerOrder": 3}]') INTO foo;
    
    SELECT openchs.create_form_element_group('Vitals', 'cb8b6812-b58b-428d-afbd-7f53748c684d', 2::SMALLINT, formId) INTO formElementGroupId;
    SELECT openchs.create_form_element('Diastolic', 'c253083f-a2f9-4bec-a07f-8883637125db', 1::SMALLINT, FALSE, formElementGroupId, 0, '[]') INTO foo;
    SELECT openchs.create_form_element('Systolic', '972a7890-4fa9-42c8-b4b8-fe8583c5ae80', 2::SMALLINT, FALSE, formElementGroupId, 0, '[]') INTO foo;
    SELECT openchs.create_form_element('Pulse', '099dd8f5-ed61-4195-ba8c-2a9f26317642', 3::SMALLINT, FALSE, formElementGroupId, 0, '[]') INTO foo;
    SELECT openchs.create_form_element('Respiratory Rate', '407b2857-e5cd-4805-9b2c-c43c2e819b04', 4::SMALLINT, FALSE, formElementGroupId, 0, '[]') INTO foo;
    SELECT openchs.create_form_element('Temperature', '86d906d2-f44f-4743-9044-f7b23df6d5d8', 5::SMALLINT, FALSE, formElementGroupId, 0, '[]') INTO foo;


    -- Abortion --

    SELECT openchs.create_form('Abortion', '32428a7e-d553-4172-b697-e8df3bbfb61d', 'ProgramEncounter', programId, 'd432bb74-071d-497d-a90f-4706a1dbfc2a', '62c196cc-c226-46c7-b347-45358a97fc5d') INTO formId;
    SELECT openchs.create_form_element_group('Default', 'db1d4fbd-f885-4e56-9c25-1bf4dc4e2805', 1::SMALLINT, formId) INTO formElementGroupId;
    SELECT openchs.create_form_element_for_concept('Date of abortion', '1f54eacd-2004-4b9b-8f29-c67d94f74103', 1::SMALLINT, TRUE, formElementGroupId, '[]', '56fdb516-37f1-444c-a55a-473cef77ee6a', 'Date') INTO foo;
    SELECT openchs.create_form_element_for_concept('Date of discharge', '041c5758-d2aa-473c-b3f1-20fc529056cd', 2::SMALLINT, FALSE, formElementGroupId, '[]', '09a14193-7bce-46b6-9429-9d8cd3d4c0e5', 'Date') INTO foo;
    SELECT openchs.create_form_element_for_concept_with_answers('Type of Abortion', 'abf596f7-aefd-4938-86b0-49e75fdf6511', 3::SMALLINT, FALSE, formElementGroupId, '[{"key": "Select", "value": "Single"}]', 'c85239e5-f428-40df-9cb9-43fd8e71a9f5', '[{"name": "Induced", "uuid": "6138d547-a40f-4030-8e37-cebd9073bdc9", "answerOrder": 1}, {"name": "Spontaneous", "uuid": "d14e9a4e-c86b-4a49-86b5-4e68f4ce6985", "answerOrder": 2}]') INTO foo;
    SELECT openchs.create_form_element_for_concept_with_answers('Place of abortion', '012590a5-15e9-445a-b75f-e41a9d0688cf', 4::SMALLINT, FALSE, formElementGroupId, '[]', '8cdf3ca8-7a44-4e15-9bec-22cc25872e8f', '[{"name": "Home", "uuid": "8592be4c-5b34-47bb-b718-ddc19352b19b", "answerOrder": 1}, {"name": "Institutional", "uuid": "65ac5965-ab42-422a-bbbb-2359595af2bf", "answerOrder": 2}]') INTO foo;

    EXCEPTION WHEN others THEN
    raise notice '% %', SQLERRM, SQLSTATE;
END;
$$ LANGUAGE plpgsql;

SELECT openchs.setupProgramEncounterForms();