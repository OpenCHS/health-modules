CREATE OR REPLACE FUNCTION setupProgramExitForms()
  RETURNS VOID AS $$
  DECLARE programId BIGINT;
  DECLARE exitForm BIGINT;
  DECLARE defaultMotherFormGroup BIGINT;
  DECLARE defaultChildFormGroup BIGINT;
  DECLARE deathReasonConceptId BIGINT;
  DECLARE deathPlaceConceptId BIGINT;
  DECLARE deathConceptId BIGINT;
  DECLARE abortionConceptId BIGINT;
  DECLARE shiftedConceptId BIGINT;
  DECLARE completionConceptId BIGINT;
  DECLARE motherExitReasonConceptId BIGINT;
  DECLARE childExitReasonConceptId BIGINT;
  DECLARE foo RECORD;
  DECLARE metaDataVersionName VARCHAR(50) := 'V0_4__programExitForms';
BEGIN
  raise notice 'Starting %...', metaDataVersionName;
    SELECT id INTO foo from openchs.health_metadata_version where name = metaDataVersionName;
    IF foo is NULL THEN
      INSERT INTO openchs.health_metadata_version (name) VALUES (metaDataVersionName);
    ELSE
      raise notice '% already run.', metaDataVersionName;
      RETURN;
    END IF;

  SELECT id FROM program WHERE name = 'Mother' INTO programId;

-- Since concepts are shared first creating all the concepts
  SELECT create_concept('Death reason', 'Text', 'd6b15127-4f2c-433f-94ba-d7d2bc9278ab') INTO deathReasonConceptId;
  SELECT create_concept('Death place', 'Text', '0c140e1c-448f-48e8-aa66-df450e7823cb') INTO deathPlaceConceptId;
  SELECT create_concept('Death', 'N/A', '148ee35c-51a8-48e1-91ae-c82efc7b8f65') INTO deathConceptId;
  SELECT create_concept('Abortion', 'N/A', 'b2103185-5815-46a7-88f1-48a43919dc73') INTO abortionConceptId;
  SELECT create_concept('Shifted to other geographical area', 'N/A', '4bd29168-8051-4158-ab0f-7b8652d116f6') INTO shiftedConceptId;
  SELECT create_concept('Completion', 'N/A', '7ae9c223-9369-4fb7-a80b-4b6ea63bd356') INTO completionConceptId;
  SELECT create_concept('Mother exit reason', 'Coded', '2d4eb9f6-0e25-447b-9d41-c7c30d487b9d') INTO motherExitReasonConceptId;
  SELECT create_concept('Child exit reason', 'Coded', 'd1ddaec3-0692-4705-8db5-014ca097bbdd') INTO childExitReasonConceptId;

  SELECT add_answer_to_concept('Mother exit reason', 'Death', 1, '81f87734-9f33-4c22-b668-413a7d54ea1c') INTO foo;
  SELECT add_answer_to_concept('Mother exit reason', 'Abortion', 2, 'e54c653f-a30a-4942-8104-cb56c9464032') INTO foo;
  SELECT add_answer_to_concept('Mother exit reason', 'Shifted to other geographical area', 3, '17b9b81a-8577-4b09-b668-49f7957e7cfe') INTO foo;
  SELECT add_answer_to_concept('Mother exit reason', 'Completion', 4, '9ef16c65-f952-42cf-9a0a-30961f421c36') INTO foo;

  SELECT add_answer_to_concept('Child exit reason', 'Death', 1, 'e37d1c47-7393-4e3f-9195-44ba40a9f309') INTO foo;
  SELECT add_answer_to_concept('Child exit reason', 'Shifted to other geographical area', 2, '54ff30d9-bd56-4720-8b21-a2a1611f7bf0') INTO foo;
  SELECT add_answer_to_concept('Child exit reason', 'Completion', 3, '22f00fa8-1e59-4427-994b-45d1e34ac48b') INTO foo;

  SELECT create_form('Mother Exit', 'e57e2f11-6684-456a-bd00-6511d9b06eaa', 'ProgramExit', programId, 'd82e272a-6519-4291-a4d8-6b9d45a82cd9', NULL) INTO exitForm;
  SELECT create_form_element_group('Default Mother Exit', '0f2c45e2-d5fa-40cc-855d-18deedd4e459', 1::SMALLINT, exitForm) INTO defaultMotherFormGroup;
  SELECT create_form_element('Mother exit reason', 'fcb4209d-f752-4898-aa7a-b9be066dfb0d', 1::SMALLINT , TRUE, defaultMotherFormGroup, motherExitReasonConceptId, '[{"key": "Select", "value": "Single"}]') INTO foo;
  SELECT create_form_element('Death reason', '4876f1ce-28f0-4788-8d22-d8a3db617fd2', 2::SMALLINT , FALSE, defaultMotherFormGroup, deathReasonConceptId, '[]') INTO foo;
  SELECT create_form_element('Death place', '1ca19a30-1b67-4dd3-9994-c2048813aeff', 3::SMALLINT , FALSE, defaultMotherFormGroup, deathPlaceConceptId, '[]') INTO foo;


  SELECT id FROM program WHERE name = 'Child' INTO programId;
  SELECT create_form('Child Exit', '67165f46-890d-4747-ba9a-dbaa0cfa5353', 'ProgramExit', programId, '43931a65-290f-492b-ae66-1325e6de91c7', NULL) INTO exitForm;
  SELECT create_form_element_group('Default Child Exit', '4cda489f-1891-4533-a8c3-30b936ea866f', 1::SMALLINT, exitForm) INTO defaultChildFormGroup;
  SELECT create_form_element('Child exit reason', '443462ad-4de0-4d6f-bfbc-bc8c1404b131', 1::SMALLINT , TRUE, defaultChildFormGroup, childExitReasonConceptId, '[{"key": "Select", "value": "Single"}]') INTO foo;
  SELECT create_form_element('Death reason', 'f6efd6e9-ea2d-4a8f-baeb-6fe12a86f7d8', 2::SMALLINT , FALSE, defaultChildFormGroup, deathReasonConceptId, '[]') INTO foo;
  SELECT create_form_element('Death place', '83e6cb7b-5f2d-4c5b-a9d1-0be071d6e956', 3::SMALLINT , FALSE, defaultChildFormGroup, deathPlaceConceptId, '[]') INTO foo;

  EXCEPTION WHEN others THEN
  raise notice '% %', SQLERRM, SQLSTATE;
END;
$$ LANGUAGE plpgsql;

SELECT openchs.setupProgramExitForms();