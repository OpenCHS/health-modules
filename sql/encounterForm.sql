CREATE OR REPLACE FUNCTION setupEncounterForm()
  RETURNS VOID AS $$
  DECLARE encounterForm BIGINT;
  DECLARE vitals BIGINT;
  DECLARE Physical BIGINT;
  DECLARE Complaint BIGINT;
  DECLARE foo RECORD;
BEGIN
    raise notice 'Starting....';

    SELECT deleteMetaDataCascade('encounter_form') INTO foo;

    SELECT create_form('encounter_form', 'e1472f56-c057-4aea-9f46-0decd9d068fe', 'Encounter', null, 'd5ed95fe-ae91-4a70-95eb-ee3d2e16b404') INTO encounterForm;

    SELECT create_form_element_group('Vitals', '52c7a463-3044-4ac6-8bfa-dae86fd20878', 1::SMALLINT, encounterForm) INTO vitals;
    SELECT create_form_element_for_concept('Weight', '7b7fd4ed-61b5-490e-be96-251dcfd9dda4', 1, TRUE, vitals, '[]', '7907e658-d25e-4823-9c0d-b56843010232', 'Numeric') INTO foo;
    SELECT create_form_element_for_concept('Temperature', '294c23fb-aef2-499c-b91f-3294df5a28c0', 2, FALSE , vitals, '[]', '82558a1f-4412-4093-87de-6128b4eb5268', 'Numeric') INTO foo;
    SELECT create_form_element_for_concept('Respiratory Rate', '1840d8b3-93a8-4a17-8ef9-40767e21a0a7', 3, FALSE , vitals, '[]', '0cd1c5c5-f003-4965-9ff0-685b1e6ed353', 'Numeric') INTO foo;
    SELECT create_form_element_for_concept('Pulse', 'd24edbd7-1ee5-4065-9f77-18aacd9bb88d', 4, FALSE , vitals, '[]', 'be09a6be-ddd5-4fcc-8082-f77c725ed338', 'Numeric') INTO foo;
    SELECT create_form_element_for_concept('Systolic', '785c1b57-f494-49c1-aa88-499c9e0af894', 5, FALSE , vitals, '[]', '104f5b1a-b3a6-441a-bf89-24b072854c38', 'Numeric') INTO foo;
    SELECT create_form_element_for_concept('Diastolic', 'e02226d8-2dd2-4cd7-ae1a-321a40d913f4', 6, FALSE , vitals, '[]', '490a73da-df6e-4d92-82c6-37abea99deb8', 'Numeric') INTO foo;

    SELECT create_form_element_group('Physical Examination', 'cfca8e29-cbf2-4fda-a691-b8fa15abab14', 2::SMALLINT, encounterForm) INTO Physical;
    SELECT create_form_element_for_concept('Pallor', '0321fdc2-055f-44ac-a24e-c66314f04127', 1, FALSE , Physical, '[{"key": "TrueValue", "value": "Present"}, {"key": "FalseValue", "value": "Absent"}]', '5e9de8a2-eae3-479a-ab11-8576bab8319e', 'Boolean') INTO foo;
    SELECT create_form_element_for_concept('Pedal Edema', '57db3bc2-4a09-4351-bf44-edfe46e00ac1', 2, FALSE , Physical, '[{"key": "TrueValue", "value": "Present"}, {"key": "FalseValue", "value": "Absent"}]', '8928a9eb-25f0-4e6a-9e54-1ac1bebf9bfa', 'Boolean') INTO foo;
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