echo "executing the impl setup"
psql -h $OPENCHS_DATABASE_HOST -U openchs -q -f $IMPL_DIR/villages.sql
psql -h $OPENCHS_DATABASE_HOST -U openchs -q -f $IMPL_DIR/catchments.sql
curl -X POST http://$(OPENCHS_SERVER):$(OPENCHS_SERVER_PORT)/forms -d @$IMPL_DIR/registrationForm.json -H "Content-Type: application/json"
