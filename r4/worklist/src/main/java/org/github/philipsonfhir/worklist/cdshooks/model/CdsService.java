package org.github.philipsonfhir.worklist.cdshooks.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CdsService {
    String hook;
    String title;
    String name;
    String description;
    String id;
    Prefetch prefetch;

    String url;
}