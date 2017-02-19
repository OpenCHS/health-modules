CREATE OR REPLACE FUNCTION setupEncounterForm()
  RETURNS VOID AS $$
  DECLARE encounterForm BIGINT;
  DECLARE vitals BIGINT;
  DECLARE Physical BIGINT;
  DECLARE Complaint BIGINT;
  DECLARE foo RECORD;
BEGIN
    raise notice 'Starting....';

    SELECT create_form('encounter_form', 'e1472f56-c057-4aea-9f46-0decd9d068fe', 'Encounter', null, 'd5ed95fe-ae91-4a70-95eb-ee3d2e16b404') INTO encounterForm;

    SELECT create_form_element_group('Vitals', '52c7a463-3044-4ac6-8bfa-dae86fd20878', 1::SMALLINT, encounterForm) INTO vitals;
    SELECT create_form_element_for_concept('Weight', '7b7fd4ed-61b5-490e-be96-251dcfd9dda4', 1, TRUE, vitals, '[]', '7907e658-d25e-4823-9c0d-b56843010232', 'Numeric') INTO foo;
    SELECT create_form_element_for_concept('Temperature', '294c23fb-aef2-499c-b91f-3294df5a28c0', 2, FALSE , vitals, '[]', '82558a1f-4412-4093-87de-6128b4eb5268', 'Numeric') INTO foo;
    SELECT create_form_element_for_concept('Respiratory Rate', '1840d8b3-93a8-4a17-8ef9-40767e21a0a7', 3, FALSE , vitals, '[]', '0cd1c5c5-f003-4965-9ff0-685b1e6ed353', 'Numeric') INTO foo;
    SELECT create_form_element_for_concept('Pulse', 'd24edbd7-1ee5-4065-9f77-18aacd9bb88d', 4, FALSE , vitals, '[]', 'be09a6be-ddd5-4fcc-8082-f77c725ed338', 'Numeric') INTO foo;
    SELECT create_form_element_for_concept('Systolic', '785c1b57-f494-49c1-aa88-499c9e0af894', 5, FALSE , vitals, '[]', '104f5b1a-b3a6-441a-bf89-24b072854c38', 'Numeric') INTO foo;
    SELECT create_form_element_for_concept('Diastolic', 'e02226d8-2dd2-4cd7-ae1a-321a40d913f4', 6, FALSE , vitals, '[]', '490a73da-df6e-4d92-82c6-37abea99deb8', 'Numeric') INTO foo;

    SELECT create_form_element_group('Physical Examination', 'cfca8e29-cbf2-4fda-a691-b8fa15abab14', 2::SMALLINT, encounterForm) INTO Physical;
    SELECT create_form_element_for_concept('Pallor', '0321fdc2-055f-44ac-a24e-c66314f04127', 1, FALSE , Physical, '[{"key": "trueValue", "value": "Present"}, {"key": "falseValue", "value": "Absent"}]', '5e9de8a2-eae3-479a-ab11-8576bab8319e', 'Boolean') INTO foo;
    SELECT create_form_element_for_concept('Pedal Edema', '57db3bc2-4a09-4351-bf44-edfe46e00ac1', 2, FALSE , Physical, '[{"key": "trueValue", "value": "Present"}, {"key": "falseValue", "value": "Absent"}]', '8928a9eb-25f0-4e6a-9e54-1ac1bebf9bfa', 'Boolean') INTO foo;
    SELECT create_form_element_for_concept_with_answers('Skin Condition', 'bfae2b55-5b91-4a1b-a6df-58d3cacf00b0', 3, FALSE , Physical, '[{"key": "Select", "value": "Multi"}]', 'dd013943-8f20-4260-84e9-98cb0088a0f1',
                  '[{"name": "Boils", "uuid": "69683ed8-6ed2-4bbb-a440-e57721dc61d2", "answerOrder": 1}, {"name": "Wound", "uuid": "3cc5035e-4122-4fa7-bd7b-279291288b95", "answerOrder": 2},        {"name": "Scabies", "uuid": "5698c54c-4040-4481-bf46-6ac49a827e9d", "answerOrder": 3}, {"name": "Ring Worm", "uuid": "b4be4ff0-109f-428f-80b2-325c6a153ce7", "answerOrder": 4}]') INTO foo;
    SELECT create_form_element_for_concept_with_answers('Paracheck', 'd797bb0c-7f75-4748-9db2-bd0349c1ee65', 4, FALSE , Physical, '[{"key": "Select", "value": "Single"}]', '1fa71494-3b1c-433e-b3eb-13c9935b949a',
                  '[{"name": "Negative", "uuid": "9208e858-7c93-48e3-b318-19adbbb27364", "answerOrder": 1}, {"name": "Positive for PF", "uuid": "bc8abc21-a64b-4603-a78b-d82373452413", "answerOrder": 2}, {"name": "Positive for PV", "uuid": "1364581b-1620-4cb7-8bc5-8f791eba1b39", "answerOrder": 3}, {"name": "Positive for PF and PV", "uuid": "73d3547c-5921-4652-8c1d-fa6106a1d2b8", "answerOrder": 4}]') INTO foo;

    SELECT create_form_element_group('Complaint', '866bae7d-1a10-48de-a68d-2aef17f92b6b', 3::SMALLINT, encounterForm) INTO Complaint;
    SELECT create_form_element_for_concept_with_answers('Complaint', '55bec1f0-a726-4a9d-93eb-eb6e06231d36', 1, TRUE, Complaint, '[{"key": "Select", "value": "Multi"}]', '8ec0637f-6f62-47ad-a0e6-08b8e3cf6f9d',
'[{"name": "Fever", "uuid": "9e0a28d5-9272-4648-9c81-002804d566ee", "answerOrder": 1}, {"name": "Chloroquine Resistant Malaria", "uuid": "45d9cd1a-dabe-4143-bad0-0b3ae27626f4", "answerOrder": 2}, {"name": "Body Ache", "uuid": "fbd438d0-b582-4d25-8f97-b185510a32fb", "answerOrder": 3}, {"name": "Headache", "uuid": "46d56a9b-bef2-4d73-b5c2-014627cba3a8", "answerOrder": 4}, {"name": "Giddiness", "uuid": "3ca187e1-cd49-47d5-8f47-3fc228a701fc", "answerOrder": 5}, {"name": "Vomiting", "uuid": "f5c1cb35-7812-4c01-8cf9-577cf27a14f2", "answerOrder": 6}, {"name": "Cough", "uuid": "8ead5f67-3e96-499c-95b6-13788c4ee652", "answerOrder": 7}, {"name": "Cold", "uuid": "79f8ec28-17e3-4bd9-90c1-e45009006905", "answerOrder": 8}, {"name": "Acidity", "uuid": "d14f6731-fa7e-4097-b933-6304189026c2", "answerOrder": 9}, {"name": "Abdominal Pain", "uuid": "c7a84d95-3be7-435d-946d-2b3b1e211cf7", "answerOrder": 10}, {"name": "Diarrhoea", "uuid": "50e606fb-f6bb-4183-9121-860ce9aecfd4", "answerOrder": 11}, {"name": "Pregnancy", "uuid": "00adcc38-8c10-4808-9ba1-c9729cab0afc", "answerOrder": 16}]') INTO foo;

    SELECT add_answer_to_concept('Complaint', 'Boils', 12, '3a66b41b-751e-4212-aede-4e1703660039') INTO foo;
    SELECT add_answer_to_concept('Complaint', 'Wound', 13, '8d8c2c34-aac1-46cb-b513-6f665e91db2b') INTO foo;
    SELECT add_answer_to_concept('Complaint', 'Scabies', 14, '0d56334a-d1b0-4c85-b3e8-19d82ae328a0') INTO foo;
    SELECT add_answer_to_concept('Complaint', 'Ring Worm', 15, '61657b5c-81f2-453f-b960-8dc00767f8c9') INTO foo;

    SELECT create_concept('Treatment', 'Text', '2125c14c-2de3-4978-aa89-82ab5fde825e') INTO foo;

    EXCEPTION WHEN others THEN
    raise notice '% %', SQLERRM, SQLSTATE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION setupIndividualRegistrationForm()
  RETURNS VOID AS $$
DECLARE registrationForm BIGINT;
  DECLARE family BIGINT;
  DECLARE socioEconomic BIGINT;
  DECLARE medical BIGINT;
  DECLARE foo RECORD;
BEGIN
  raise notice 'Starting....';

  SELECT create_form('registration_form', '881f0ddb-ce35-4372-abae-622fb04bc236', 'IndividualProfile', null, '14df9349-f191-48f6-ba7b-986f16b2f6e1') INTO registrationForm;


  SELECT create_form_element_group('Family', '3aa06f6b-ecba-4e20-a87a-15fabd495b6b', 1::SMALLINT, registrationForm) INTO family;
  SELECT create_form_element_for_concept('Husband Name', '34397241-8529-45c0-94c2-de523d052002', 1, FALSE, family, '[]', 'efc2665d-e36c-4974-a090-4ac0070f7291', 'Text') INTO foo;
  SELECT create_form_element_for_concept('Number of Members in House', 'ba602a8e-69d2-49d2-960c-3f130d616686', 2, FALSE , family, '[]', '21be71fe-0426-449c-aef9-e4ba35b50a46', 'Numeric') INTO foo;


  SELECT create_form_element_group('Socio Economic', '2482522b-34e5-4c82-8e80-9a856425b227', 2::SMALLINT, registrationForm) INTO socioEconomic;
  SELECT create_form_element_for_concept_with_answers('Education', '9035da14-ec2f-489f-89c8-a776c986d968', 1, FALSE, socioEconomic, '[{"key": "Select", "value": "Single"}]', 'ee29be5c-a5b1-4e5c-ae85-804bb973d085', '[{"name": "Illiterate", "uuid": "86643103-8953-4c90-9071-0a12687e7dc4", "answerOrder": 1}, {"name": "Literate without schooling", "uuid": "76cfdde2-f0db-4174-bdfa-974d92ee9fd5", "answerOrder": 2}, {"name": "1-5", "uuid": "1a9abc92-209d-465c-9f2e-1d99ae883a9a", "answerOrder": 3}, {"name": "6-7", "uuid": "e216758b-56f5-454e-9353-a488fd881139", "answerOrder": 4}, {"name": "8-10", "uuid": "a7331c94-d4eb-46e7-834c-fb41384d0018", "answerOrder": 5}, {"name": "11-12", "uuid": "915ca15c-3eba-472a-8db0-c63efffae7f2", "answerOrder": 6}, {"name": "Graduations", "uuid": "c16888b4-53ae-4752-8650-41c8766b0ea1", "answerOrder": 7}, {"name": "Post Graduation and above", "uuid": "cb24c12d-f54f-4440-a7d4-adcefb3f6450", "answerOrder": 8}]') INTO foo;
  SELECT create_form_element_for_concept_with_answers('Religion', '5a913f85-8707-4051-b4e2-009fc1ffa3f9', 2, FALSE, socioEconomic, '[{"key": "Select", "value": "Single"}]', 'bcc22999-b3d7-474a-a0ca-bfe4bd1f09ce', '[{"name": "Hindu", "uuid": "21883067-8ae1-4202-b19b-67049cd043d2", "answerOrder": 1}, {"name": "Muslim", "uuid": "c1441046-fab1-4b28-9456-c2bfb6283679", "answerOrder": 2}, {"name": "Christian", "uuid": "77ebe7fb-fc0a-47b9-93fe-abe2c9f56988", "answerOrder": 3}, {"name": "Sikh", "uuid": "611f1574-0d8d-413c-9634-54e06f510e19", "answerOrder": 4}, {"name": "Jain", "uuid": "816dd70d-5659-403d-949f-135bd7439c0c", "answerOrder": 5}, {"name": "Other", "uuid": "937eb8d3-96c5-4730-aff4-f3c395c00fa7", "answerOrder": 6}]') INTO foo;
  SELECT create_form_element_for_concept_with_answers('Caste Categories', '8b8f58d9-0a81-49ff-8310-81118507f81e', 3, FALSE, socioEconomic, '[{"key": "Select", "value": "Single"}]', '18a81dcf-e13e-4c14-8b3a-043bf62f5a1f', '[{"name": "SC", "uuid": "ec9ec7a2-4476-425c-b10d-688ca0f9005d", "answerOrder": 1}, {"name": "ST", "uuid": "8007fff3-4511-4d81-bd32-ee84327b87f2", "answerOrder": 2}, {"name": "OBC", "uuid": "7e715be6-a722-4b02-9ef3-2eaa254c24d5", "answerOrder": 3}, {"name": "General", "uuid": "4ef0ca6a-eff5-4de9-89b1-095cbd8575e9", "answerOrder": 4}]') INTO foo;
  SELECT create_form_element_for_concept_with_answers('Caste', 'f9025528-31a5-4800-a34d-3670f0e612d2', 4, FALSE, socioEconomic, '[{"key": "Select", "value": "Single"}]', '23f23704-1dc8-4151-bb7c-6aedf1baa114', '[{"name": "Madia", "uuid": "a825f7b7-c323-40ff-919e-18cb2e999f48", "answerOrder": 1}, {"name": "Gond", "uuid": "e6cfa2ed-245b-43e0-80d0-6cb85ced335f", "answerOrder": 2}]') INTO foo;
  SELECT create_form_element_for_concept_with_answers('Economic Status', '162b31fc-5ab5-4aa9-b368-dcc4ba183f93', 5, FALSE, socioEconomic, '[{"key": "Select", "value": "Single"}]', 'c178728e-3510-4ac3-b5db-bdf560b517f6', '[{"name": "White Card", "uuid": "13da1cf9-80d1-42a0-b798-8e0bc10ebd8d", "answerOrder": 1}, {"name": "Orange Card", "uuid": "656a62a8-7e09-425a-993b-aeeb06a959da", "answerOrder": 2}, {"name": "Yellow Card", "uuid": "bda3e7e0-8698-4447-831a-86bf0f9d0b38", "answerOrder": 3}]') INTO foo;


  SELECT create_form_element_group('Medical', 'f0733466-7d78-41e7-b864-20d421da5b41', 3::SMALLINT, registrationForm) INTO medical;
  SELECT create_form_element_for_concept_with_answers('Blood group', 'c0a869e1-8c00-4815-9e40-be3835fb5595', 1, FALSE, medical, '[{"key": "Select", "value": "Single"}]', 'ee108057-5c6c-4cc7-832c-2c3c79d372d5', '[{"name": "A+", "uuid": "bee00670-c2c6-436a-9dda-1188ee0cec07", "answerOrder": 1}, {"name": "A-", "uuid": "dacb3f24-89b6-4ddb-b434-88e0a345921f", "answerOrder": 2}, {"name": "B+", "uuid": "dc18d91a-40fc-433a-8a44-3aa095086c27", "answerOrder": 3}, {"name": "B-", "uuid": "a7cd2052-46dd-4a20-b21f-c086d7a8f52a", "answerOrder": 4}, {"name": "AB+", "uuid": "8500c18a-e803-4ab9-be32-b032638a30ab", "answerOrder": 5}, {"name": "AB-", "uuid": "f07b014b-f7d8-4c5e-9154-49d5920ae4e5", "answerOrder": 6}, {"name": "O+", "uuid": "51e596a7-fed3-4f0f-bb5a-5708b7f96779", "answerOrder": 7}, {"name": "O-", "uuid": "7bf50279-7b20-4b4b-962f-433080b435c3", "answerOrder": 8}]') INTO foo;
  SELECT create_form_element_for_concept_with_answers('Medical history', '3c748287-5529-4412-8cca-f3aa6744ea8b', 2, FALSE, medical, '[{"key": "Select", "value": "Single"}]', '46f11ad7-7478-4484-a07d-6d7590bfa4b1', '[{"name": "Hypertension", "uuid": "94e651fa-26c2-4728-9e71-d9f3d3c89f26", "answerOrder": 1}, {"name": "Diabetes", "uuid": "de590831-1822-44f8-8911-c7a1f5e9f4a2", "answerOrder": 2}, {"name": "Heart-related Diseases", "uuid": "5e6b60ab-95f0-459f-9878-51e41ce4b2ab", "answerOrder": 3}, {"name": "TB", "uuid": "6a539dc1-dc03-4c7b-983b-51d9bc9fb07b", "answerOrder": 4}]') INTO foo;

  EXCEPTION WHEN others THEN
  raise notice '% %', SQLERRM, SQLSTATE;
END;
$$ LANGUAGE plpgsql;

SELECT deleteMetaDataCascade('encounter_form');
SELECT setupEncounterForm();

SELECT deleteMetaDataCascade('registration_form');
SELECT setupIndividualRegistrationForm();

INSERT INTO program (name, uuid, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES ('Mother', 'a663fd1c-72af-443b-92d9-4c8c3ca8baef', 1, 1, 1, current_timestamp, current_timestamp);
INSERT INTO program (name, uuid, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time)
VALUES ('Child', 'f54533e4-5b3e-46f7-8f69-3ae1b1ce5172', 1, 1, 1, current_timestamp, current_timestamp);