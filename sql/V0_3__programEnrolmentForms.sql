CREATE OR REPLACE FUNCTION setupProgramEnrolmentForms()
  RETURNS VOID AS $$
  DECLARE programId BIGINT;
  DECLARE enrolmentForm BIGINT;
  DECLARE identification BIGINT;
  DECLARE gynaeHistory BIGINT;
  DECLARE obstetricsHistory BIGINT;
  DECLARE defaultChildFormGroup BIGINT;
  DECLARE foo RECORD;
DECLARE metaDataVersionName VARCHAR(50) := 'V0_3__programEnrolmentForms';
BEGIN
    raise notice 'Starting %...', metaDataVersionName;
    SELECT id INTO foo from openchs.health_metadata_version where name = metaDataVersionName;
    IF foo is NULL THEN
      INSERT INTO openchs.health_metadata_version (name) VALUES (metaDataVersionName);
    ELSE
      raise notice '% already run.', metaDataVersionName;
      RETURN;
    END IF;

  INSERT INTO program (name, uuid, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
  VALUES ('Mother', 'a663fd1c-72af-443b-92d9-4c8c3ca8baef', 1, 1, 1, current_timestamp, current_timestamp) RETURNING id INTO programId;

  SELECT create_form('Mother Enrolment', '026e2f5c-8670-4e4b-9a54-cb03bbf3093d', 'ProgramEnrolment', programId, '24c93700-c5d2-4ea8-91f5-2c46671dc79d', NULL) INTO enrolmentForm;

  SELECT create_form_element_group('Default', '2dff8c09-bed3-4848-943f-b2240b70d7ed', 1::SMALLINT, enrolmentForm) INTO identification;
  SELECT create_form_element_for_concept('Mother card number', '54917f80-15ea-416b-8746-7f2717a0dc84', 1, FALSE, identification, '[]', 'c0cb6826-4b8a-4413-9337-ffce8c5f5054', 'Text') INTO foo;
  SELECT create_form_element_for_concept('ANC registration no', 'cadad826-0b4c-4474-b256-697b49159111', 2, FALSE, identification, '[]', 'feb0513a-0f34-479f-874c-38D01182E13C', 'Text') INTO foo;
  SELECT create_form_element_for_concept('Last Menstrual Period', '10a7bb47-6780-4b43-9ebd-842b1f5cc58f', 3, FALSE, identification, '[]', 'a01644b1-0d3a-4852-9e5a-0541c0b0066c', 'Date') INTO foo;

  SELECT create_form_element_group('Gynae History', '71b33c6d-e029-43be-baff-452c3e31890d', 2::SMALLINT, enrolmentForm) INTO gynaeHistory;
  SELECT create_form_element_for_concept('Gravida', 'a21ba591-9f62-44b4-addc-44df0eea168b', 1, FALSE, gynaeHistory, '[]', 'caa42e65-1cce-4631-ab5a-82aec839735a', 'Numeric') INTO foo;
  SELECT create_form_element_for_concept('Parity', '8e82a356-22a7-44ae-b28f-2b30fd6f9664', 2, FALSE, gynaeHistory, '[]', '60181cbe-cbd8-4f2e-92df-a6bdfdcb27d3', 'Numeric') INTO foo;
  SELECT create_form_element_for_concept('Number of abortion', '7c43bedd-dbd8-46d0-9a3f-8517dcb7e18d', 3, FALSE, gynaeHistory, '[]', 'c39e9553-4861-4a33-9e32-ccbd0a27d39d', 'Numeric') INTO foo;
  SELECT create_form_element_for_concept('Number of male children', '0abd0e1e-484c-48c9-ab3a-ffa14b66c9c5', 4, FALSE, gynaeHistory, '[]', 'f7f9f8cc-dc45-42ba-a31f-a945c0b0c781', 'Numeric') INTO foo;
  SELECT create_form_element_for_concept('Number of female children', '8b7b54a0-6f07-40b4-b080-f2023ec2ee2f', 5, FALSE, gynaeHistory, '[]', 'f4e32ab1-bea3-4316-8f8e-2fbbc97c7878', 'Numeric') INTO foo;
  SELECT create_form_element_for_concept('Age of youngest child', 'd07f9fdc-2dbe-4b21-abce-eb79c30470b8', 6, FALSE, gynaeHistory, '[]', '8e4b427a-a854-4f06-9a19-2588a161cba1', 'Duration') INTO foo;
  SELECT create_form_element_with_gender_answers('Gender of youngest child', '752b1d07-c87a-429f-8813-f660e489bcea', 7, FALSE , gynaeHistory, '2bcfb991-3690-407e-be93-c18aac37c355', '[{"key": "Select", "value": "Single"}]', '["e3b0f446-b119-442a-b05a-724ec546518c", "26bec6a7-d319-477d-aaf0-cdc780fbd987", "013a6550-ebdb-4d1d-83d0-52168158e3f9"]') INTO foo;

  SELECT create_form_element_group('Obstetrics History', '50a2d045-88fe-44e3-86e0-0dba16f53818', 3::SMALLINT, enrolmentForm) INTO obstetricsHistory;
  SELECT create_form_element_for_concept('Ante Partum Haemorrhage', 'dfc86a35-bdc7-4b0f-a58b-92e5bf3c6301', 1, FALSE, obstetricsHistory, '[]', '5b5e974c-8aba-4ee3-982e-0f4e31460303', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('Post Partum Haemorrhage', '23905c0b-6c8a-4f6a-8c16-4135209fa3c5', 2, FALSE, obstetricsHistory, '[]', '6cfbaf2b-7755-449d-80d7-f1e374a09b0d', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('Pre Eclampsia/ Eclampsia', '115633e4-b17e-4bdc-a9a4-e6b90c7f5a47', 3, FALSE, obstetricsHistory, '[]', '86e79dac-85b4-4780-9776-584bd4b3e57a', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('Pregnancy Induced Hypertension', '45790951-f02e-47f6-8722-5de3894ee43a', 4, FALSE, obstetricsHistory, '[]', '82551de2-fec8-4b58-8436-6e59c41e3dbf', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('Intrauterine Growth Retardation', '7773d7d2-c875-4014-844d-f73331ab01f6', 5, FALSE, obstetricsHistory, '[]', 'd7296c74-61b0-458e-856d-df7136a5ca5d', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('Three or more than three spontaneous abortions', 'b9d5e787-0d3c-47b7-a938-b6445d146601', 6, FALSE, obstetricsHistory, '[]', 'c296b80c-a6a4-4e53-8f63-c8e2779a4054', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('Pre-term labour', '56f88de7-68c8-4039-81d2-ff1a8dd44743', 7, FALSE, obstetricsHistory, '[]', '6f8cad34-bbb3-4be1-b5d1-cce7004df907', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('Still birth', '8935204a-55a5-4f04-9637-3c337c9e6380', 8, FALSE, obstetricsHistory, '[]', 'ed3ab03f-5b1b-4395-8b30-96b9c89ea71f', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('Neonatal death within first 28 days', '57fdcd52-28cc-4a4b-85e6-416bfe079e02', 9, FALSE, obstetricsHistory, '[]', '6422da66-9ed7-439e-af07-0b724346254f', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('LSCS/C-section', '3dafdb85-30ba-45c1-a461-9e5616a8f72e', 10, FALSE, obstetricsHistory, '[]', '1dc47448-0c64-4797-868a-35b3a4bd4128', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('Retained Placenta', '10b2e0d1-24c1-40aa-a3eb-1213a68f2c39', 11, FALSE, obstetricsHistory, '[]', 'dbed30c4-c8e2-42db-a62f-2fb8b3d5158f', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('Prolonged labour', '4a27015c-2e39-4481-809a-7c9a898b4d65', 12, FALSE, obstetricsHistory, '[]', '67e21b44-77f7-4cf9-930b-36700262d918', 'Boolean') INTO foo;
  SELECT create_form_element_for_concept('Threatened abortion', 'da0582fb-7d4d-47ab-9fe7-07d097acd8bd', 13, FALSE, obstetricsHistory, '[]', '573e5b23-5576-40cf-a9c9-60d305e79e8e', 'Boolean') INTO foo;

  INSERT INTO program (name, uuid, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
  VALUES ('Child', 'f54533e4-5b3e-46f7-8f69-3ae1b1ce5172', 1, 1, 1, current_timestamp, current_timestamp)  RETURNING id INTO programId;

  SELECT create_form('Child Enrolment', '1608c2c0-0334-41a6-aab0-5c61ea1eb069', 'ProgramEnrolment', programId, 'ee0e5dcf-e873-4431-af32-81018e4ee062', NULL) INTO enrolmentForm;

  SELECT create_form_element_group('Default', '062ffc31-c311-485b-baf3-d5a95d10e97c', 1::SMALLINT, enrolmentForm) INTO defaultChildFormGroup;
  SELECT create_form_element_for_concept('Birth Weight', '03daf5f7-9689-4eaa-a1f3-c95b609329b5', 1, FALSE, defaultChildFormGroup, '[]', '9c2d005e-c1fb-4793-aacb-a1beea2eb392', 'Numeric') INTO foo;
  SELECT create_form_element_for_concept('Birth Defects', '0e656272-03c2-41a9-8935-60444909082f', 2, FALSE, defaultChildFormGroup, '[]', '663c5031-5b06-4794-954f-f6a7002c2db3', 'Text') INTO foo;
  SELECT create_form_element_for_concept_with_answers('Registration at', '59903bac-e82a-42d0-b9b5-344769e26301', 3, FALSE, defaultChildFormGroup, '[{"key": "Select", "value": "Single"}]', '7273a88d-205c-4fb8-9215-10c4b106eb13', '[{"name": "Birth", "uuid": "471c4bd6-3574-49f9-aa33-1078b9988325", "answerOrder": 1}, {"name": "In migration", "uuid": "fa0987a4-e3f9-4e48-8909-1a6f949f34ec", "answerOrder": 2}, {"name": "Retrospective registration", "uuid": "ae5a2180-05c8-4a1f-9ac0-982c676c99b3", "answerOrder": 3}]') INTO foo;

  EXCEPTION WHEN others THEN
  raise notice '% %', SQLERRM, SQLSTATE;
END;
$$ LANGUAGE plpgsql;

SELECT openchs.setupProgramEnrolmentForms();