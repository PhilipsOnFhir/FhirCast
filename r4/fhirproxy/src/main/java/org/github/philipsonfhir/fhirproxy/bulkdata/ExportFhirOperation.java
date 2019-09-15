package org.github.philipsonfhir.fhirproxy.bulkdata;

import org.github.philipsonfhir.fhirproxy.common.FhirProxyException;
import org.github.philipsonfhir.fhirproxy.common.fhircall.FhirCall;
import org.github.philipsonfhir.fhirproxy.common.fhircall.FhirRequest;
import org.github.philipsonfhir.fhirproxy.common.operation.FhirBaseOperation;
import org.github.philipsonfhir.fhirproxy.controller.service.FhirServer;

public class ExportFhirOperation implements FhirBaseOperation {


    @Override
    public FhirCall createFhirCall(FhirServer fhirServer, FhirRequest fhirRequest) throws FhirProxyException {
        BulkdataParameters bulkdataParameters = new BulkdataParameters( fhirRequest );
        return new ExportFhirCall( fhirServer, bulkdataParameters.getOutputFormat(), bulkdataParameters.getSince(), bulkdataParameters.getType());
    }

    @Override
    public String getOperationName() {
        return "$export";
    }

}
