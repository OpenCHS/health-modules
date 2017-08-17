echo "executing the impl setup"
curl -X POST http://$OPENCHS_SERVER:$OPENCHS_SERVER_PORT/catchments -d @./lbp/catchments.json -H "Content-Type: application/json"
curl -X POST http://$OPENCHS_SERVER:$OPENCHS_SERVER_PORT/forms -d @$IMPL_DIR/registrationForm.json -H "Content-Type: application/json"
