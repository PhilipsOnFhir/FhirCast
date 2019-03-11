package com.github.philipsonfhir.fhircast.server.wsstomp;

import com.github.philipsonfhir.fhircast.server.topic.FhirCastContextService;
import com.github.philipsonfhir.fhircast.server.topic.FhirCastTopic;
import com.github.philipsonfhir.fhircast.support.FhirCastException;
import com.github.philipsonfhir.fhircast.support.NotImplementedException;
import com.github.philipsonfhir.fhircast.support.websub.FhirCastWorkflowEventEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.logging.Logger;

@Controller
@RestController
@CrossOrigin(origins = "*")
public class FhirCastWebsocketController  {

    private Logger logger = Logger.getLogger( this.getClass().getName());

    @Autowired
    private FhirCastContextService fhirCastContextService;

    @MessageMapping("/fhircast/{topic}/{event}")
    @SendTo("/hub/fhircast/{topic}/{event}")
    public FhirCastWorkflowEventEvent fhircastEvent(@DestinationVariable String topic,@DestinationVariable String event, FhirCastWorkflowEventEvent fhirCastEvent) throws NotImplementedException {
        logger.info("WebSocket event "+topic+"/"+event+"/"+fhirCastEvent );
        try {
            FhirCastTopic fhirCastTopic = fhirCastContextService.getTopic( topic );
            switch ( fhirCastEvent.getHub_event() ){
                case OPEN_PATIENT_CHART:
                    fhirCastTopic.openPatientChart( fhirCastEvent.retrievePatientFromContext() );
                    break;
                case SWITCH_PATIENT_CHART:
                    fhirCastTopic.switchPatient( fhirCastEvent.retrievePatientFromContext() );
                    break;
                case CLOSE_PATIENT_CHART:
                    fhirCastTopic.close( fhirCastEvent.retrievePatientFromContext() );
                    break;
                case USER_LOGOUT:
                    fhirCastTopic.userLogout();
                default:
                    logger.warning( "unknown event" );
            }

        } catch ( FhirCastException e ) {
            e.printStackTrace();
        }
        return fhirCastEvent;
    }

}