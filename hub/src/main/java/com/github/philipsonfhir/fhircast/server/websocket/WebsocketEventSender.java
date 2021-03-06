package com.github.philipsonfhir.fhircast.server.websocket;

import com.github.philipsonfhir.fhircast.server.controller.EventChannelListener;
import com.github.philipsonfhir.fhircast.support.websub.FhirCastWorkflowEventEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

import static java.util.concurrent.TimeUnit.SECONDS;

@Controller
public class WebsocketEventSender implements EventChannelListener {

    @Autowired
    Environment environment;

    private String websocketUrl;
    private static final String SEND_FHICAST_EVENT_ENDPOINT = "/app/fhircast/";
    private static final String SUBSCRIBE_FHICAST_EVENT_ENDPOINT = "/hub/fhircast/";

    WebsocketEventSender(){
    }

    @Override
    public void sendEvent(FhirCastWorkflowEventEvent fhirCastEvent) {
        String port = environment.getProperty("local.server.port");
        websocketUrl = "ws://localhost:" + port + "/fhircast/websocket";

        WebSocketStompClient stompClient = new WebSocketStompClient(new SockJsClient(createTransportClient()));
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        StompSession stompSession = null;
        try {
            stompSession = stompClient.connect(
                websocketUrl,
                new StompSessionHandlerAdapter() {}
            ).get(1, SECONDS);
            FhircastSendFrameHandler fhircastSendFrameHandler = new FhircastSendFrameHandler();

            String destination = SEND_FHICAST_EVENT_ENDPOINT + fhirCastEvent.getHub_topic()+"/"+fhirCastEvent.getHub_event().getName();
            stompSession.send( destination, fhirCastEvent);
            stompSession.disconnect();
        } catch ( Exception e ) {
            e.printStackTrace();
        }
    }

    private List<Transport> createTransportClient() {
        List<Transport> transports = new ArrayList<>(1);
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));
        return transports;
    }

    private class FhircastSendFrameHandler implements StompFrameHandler {
        private CompletableFuture<FhirCastWorkflowEventEvent> fhircastCompletableFuture = new CompletableFuture<>();

        @Override
        public Type getPayloadType(StompHeaders stompHeaders) {
            System.out.println("FhircastSendFrameHandler.getPayloadType "+stompHeaders.toString());
            return FhirCastWorkflowEventEvent.class;
        }

        @Override
        public void handleFrame(StompHeaders stompHeaders, Object o) {
            System.out.println("FhircastSendFrameHandler.handleFrame "+ o );
            this.fhircastCompletableFuture.complete((FhirCastWorkflowEventEvent) o);
        }

        FhirCastWorkflowEventEvent getResult() throws InterruptedException, ExecutionException, TimeoutException {
            return fhircastCompletableFuture.get(5, SECONDS);
        }
    }
}
