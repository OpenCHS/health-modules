CREATE OR REPLACE FUNCTION setupIndividualRegistrationForm()
  RETURNS VOID AS $$
DECLARE registrationForm BIGINT;
  DECLARE family BIGINT;
  DECLARE socioEconomic BIGINT;
  DECLARE medical BIGINT;
  DECLARE foo RECORD;
BEGIN
  raise notice 'Starting setupIndividualRegistrationForm...';

  SELECT create_form('registration_form', '881f0ddb-ce35-4372-abae-622fb04bc236', 'IndividualProfile', null, '14df9349-f191-48f6-ba7b-986f16b2f6e1', NULL) INTO registrationForm;

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
