import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {observable, Observable} from "rxjs";
import {ConnectorService} from "./connector.service";
import {Patient} from "fhir2angular-r4";
import {Resource} from "fhir2angular-r4";
import {Practitioner} from "fhir2angular-r4";
import {Encounter} from "fhir2angular-r4";


@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private topicIds: string[];
  private baseUrl       = "http://localhost:9401/api/fhircast/";
  private baseTopicUrl  = this.baseUrl+"topic/";
  private baseLaunchUrl = this.baseUrl+"launch/";

  constructor(  private http: HttpClient, private httpSec: ConnectorService ) {
  }

  updateTopidIds(): Observable<any> {
    return new Observable<any>(
      observable => {

        this.httpSec.get<string[]>( this.baseTopicUrl  ).subscribe(
          next => { console.log( next);
              this.topicIds = next;
              observable.next();
              observable.complete();
          },
          error=> { console.log( error);         observable.error('Invalid URL');
          }
        );
      }
    );

  }

  createTopicId(): Observable<string> {
    return new Observable<string>(
      observable => {
        this.httpSec.post<any>( this.baseTopicUrl, "", {observe: 'response' as 'body'} ).subscribe(
          next => {
              let topicId = (next as HttpResponse<any>).body.topicID;
              this.updateTopidIds().subscribe(
                next => {
                  observable.next(topicId);
                  observable.complete()
                },
                error => {}
              )
          },
        error=> { observable.error(error) }
        );

      }
    )
  }


  getTopicIds():string[] {
    return this.topicIds;
  }

  closeTopic( topicId:string ): Observable<string> {
    console.log("close topic "+topicId);
    console.log(this.baseTopicUrl+topicId);
    return this.httpSec.delete( this.baseTopicUrl+topicId);
  }

  openLaunch(topicId:string,  patient: Resource) :Observable<string> {
    console.log("topic open launch for "+patient);
      return this.httpSec.post(this.baseTopicUrl+topicId, patient, {responseType: 'text' as 'json' } );
  }

  getLaunchInfo( launchId: string) :Observable<LaunchInfo> {
    console.log("GET Launch info "+launchId+" - "+this.baseLaunchUrl+launchId );
    // return this.httpSec.get<LaunchInfo>( this.baseLaunchUrl+launchId,{responseType: 'text' as 'json' } )
    return this.httpSec.get<LaunchInfo>( this.baseLaunchUrl+launchId )
  }

  getPractitioner() {
    return this.httpSec.get<Practitioner>( this.baseUrl );
  }
}

class LaunchInfo {
  encounter: Encounter;
  patient: Patient;
}