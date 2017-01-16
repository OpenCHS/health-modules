CREATE OR REPLACE FUNCTION setupData()
  RETURNS VOID AS $$
  DECLARE motherEnrolmentFormId BIGINT;
  DECLARE motherEnrolmentFormDefaultFormGroup BIGINT;
  DECLARE formElementId BIGINT;
BEGIN
    SELECT create_form('Mother Enrolment', 'e1472f56-c057-4aea-9f46-0decd9d068fe', 'ProgramEnrolment') INTO motherEnrolmentFormId;
    raise notice 'Form Created';

    SELECT create_form_group('Foo', '52c7a463-3044-4ac6-8bfa-dae86fd20878', 1::SMALLINT, motherEnrolmentFormId) INTO motherEnrolmentFormDefaultFormGroup;
    raise notice 'Form Element Group Created';

    SELECT insert_form_element_for_concept('Mother card number', 'eda62db6-08e9-4140-b655-764667d3dd20', 1, TRUE, motherEnrolmentFormDefaultFormGroup, '70933ea3-3a18-4107-bc16-fbc5950b1a46', 'Text') INTO formElementId;
    raise notice 'insert_form_element_for_concept';

    SELECT insert_form_element_for_concept('ANC registration no', '5ff4af00-0891-43fd-9903-b240afaec329', 1, TRUE, motherEnrolmentFormDefaultFormGroup, 'a2beebfa-3140-4b44-a3a3-cd4d97473471', 'Text') INTO formElementId;
    raise notice 'insert_form_element_for_concept';

    EXCEPTION WHEN others THEN
    raise notice '% %', SQLERRM, SQLSTATE;
END;
$$ LANGUAGE plpgsql;

SELECT setupdata();