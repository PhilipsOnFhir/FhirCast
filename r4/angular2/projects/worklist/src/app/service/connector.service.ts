import {Injectable} from '@angular/core';
import { Cookie } from 'ng2-cookies';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
import {Observable} from "rxjs";

@Injectable()
export class ConnectorService {
  public clientId = 'worklist';
  public redirectUri = 'http://localhost:4401/';

  constructor( private _http: HttpClient){}

  retrieveToken(code){
    console.log("retrieve token");
    let params = new URLSearchParams();
    params.append('grant_type','authorization_code');
    params.append('client_id', this.clientId);
    params.append('redirect_uri', this.redirectUri);
    params.append('code',code);

    let headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Basic '+btoa(this.clientId+":worklist-secret")});
    this._http.post('http://localhost:9401/oauth/token', params.toString(), { headers: headers })
      .subscribe(
        data => this.saveToken(data),
        err => { console.log(err);alert('Invalid Credentials');}
      );
  }

  saveToken(token){
    console.log(token);
    let expireDate = new Date().getTime() + (1000 * token.expires_in);
    Cookie.set("access_token", token.access_token, expireDate);
    console.log('Obtained Access token');
    window.location.href = 'http://localhost:4401';
  }

  get<T>(resourceUrl, options?) : Observable<T>{
      console.log(resourceUrl);
      let accessToken = Cookie.get('access_token')
      return new Observable<T>( obs => {
        let headers = new HttpHeaders({'Authorization': 'Bearer '+accessToken});
        if ( options && options.headers ){
          options.headers = options.headers.append( 'Authorization', 'Bearer '+accessToken );
        } else if ( options && !options.headers ){
          options.headers = headers;
        }
        let newOptions = ( options? options: { headers: headers });

        this._http.get(resourceUrl, newOptions).subscribe(
          nxt => {obs.next((nxt as unknown) as T); obs.complete()},
          err => obs.error(err)
        )
         // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
      })
  }

  put<T>(url: string, body: any| null, options?): Observable<T> {
    console.log(url);
    let accessToken = Cookie.get('access_token')
    return new Observable<T>( obs => {
      let headers = new HttpHeaders({'Authorization': 'Bearer '+accessToken});
      if ( options && options.headers ){
        options.headers = options.headers.append( 'Authorization', 'Bearer '+accessToken );
      } else if ( options && !options.headers ){
        options.headers = headers;
      }
      let newOptions = ( options? options: { headers: headers });

      // this._http.post<T>(resourceUrl, body,{ headers: headers }).subscribe(
      this._http.put<T>(url, body, newOptions).subscribe(
        nxt => {obs.next((nxt as unknown) as T); obs.complete()},
        err => obs.error(err)
      )
      // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    })
  }

  post<T>(resourceUrl, body: any | null, options?) : Observable<T>{
    console.log(resourceUrl);
    let accessToken = Cookie.get('access_token')
    return new Observable<T>( obs => {
      let headers = new HttpHeaders({'Authorization': 'Bearer '+accessToken});
      if ( options && options.headers ){
        options.headers = options.headers.append( 'Authorization', 'Bearer '+accessToken );
      } else if ( options && !options.headers ){
        options.headers = headers;
      }
      let newOptions = ( options? options: { headers: headers });

      // this._http.post<T>(resourceUrl, body,{ headers: headers }).subscribe(
      this._http.post<T>(resourceUrl, body,newOptions).subscribe(
        nxt => {obs.next((nxt as unknown) as T); obs.complete()},
        err => obs.error(err)
      )
      // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    })

    // var headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Bearer '+Cookie.get('access_token')});
    // return this._http.get(resourceUrl, { headers: headers })
    //   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  checkCredentials(){
    return Cookie.check('access_token');
  }

  login(){
    let url = 'http://localhost:9401/oauth/authorize?response_type=code&client_id=' + this.clientId + '&redirect_uri='+ this.redirectUri;
    url = url + '&scope=topic+fhircast'
    console.log(url);
    window.location.href = url;
  }

  logout() {
    Cookie.delete('access_token')
    window.location.reload();
  }

  delete(url: string, options? ) : Observable<any> {
    console.log("DELETE " + url);
    let accessToken = Cookie.get('access_token')
    return new Observable<any>( obs => {
      let headers = new HttpHeaders({'Authorization': 'Bearer '+accessToken});
      if ( options && options.headers ){
        options.headers = options.headers.append( 'Authorization', 'Bearer '+accessToken );
      } else if ( options && !options.headers ){
        options.headers = headers;
      }
      let newOptions = ( options? options: { headers: headers });

      // this._http.post<T>(resourceUrl, body,{ headers: headers }).subscribe(
        this._http.delete(url, newOptions).subscribe(
          nxt => { obs.next(); obs.complete() },
          err => obs.error(err)
        )
        // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
      });
  }
}