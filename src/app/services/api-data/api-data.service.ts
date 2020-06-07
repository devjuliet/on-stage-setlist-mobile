import { Injectable } from '@angular/core';
import { deployConf } from './../../utils/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerMessage } from '../../classes/serverMessages.class'
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../classes/user.class';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  baseURL: string = deployConf.apiUrl;
  token: String;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  setToken(newToken : String){
    this.token = newToken;
  }

  getUserData(token : String) {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
      })
       
      this.http.get(this.baseURL + 'login/validate-token',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  doLogin(username : String, password : String) {
    return new Promise((resolve,reject)=>{
      const data = {username : username , password : password};

      this.http.post(this.baseURL + 'login',data,{}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async registerUser(name : String, username : String,email : String, password : String, role : Number){
    return new Promise((resolve,reject)=>{
      const data = {
        name : name,
        email : email, 
        haveImage : false,//valor default
        username : username,
        role : role,
        password : password, 
        type : 0, 
        description : "",
      };

      this.http.post(this.baseURL + 'user/register',data,{}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async updateUser(updatedUser : User){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'user/update-user',updatedUser,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  async changePasswordUser(idUser : Number,newPassword : String,){
    return new Promise((resolve,reject)=>{
      const data = {
        idUser : idUser,
        newPassword : newPassword,
      };
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post(this.baseURL + 'user/change-user-pass',data,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }

  getHistoryUser() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      });
       
      this.http.get(this.baseURL + 'band-members/history',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }


  getImage(url : string) : Promise<any> {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });
      
      this.http.get(url, { headers: headers,responseType: 'blob' })
      .pipe(
        timeout(2000),
        catchError(e => {
          // do something on a timeout
          //reject(e);
          return of(null);
        })
      ).subscribe((imageBlob)=>{
        let objectURL = "";
        if(imageBlob!=null && imageBlob!=undefined){
          objectURL = URL.createObjectURL(imageBlob);
        }
        resolve(this.sanitizer.bypassSecurityTrustUrl(objectURL) );
      },(error : ServerMessage)=>{
        reject(error)
      });
    })
  } 

  deleteImageUser(idUser){
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.token,
      });
      this.http.get(this.baseURL + 'uploads/user-delete-image/'+idUser,{headers:headers}).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(new ServerMessage(true,"A ocurrido un error inesperado",error));
      });
    });
  }

  getNextEvents() {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      });
       
      this.http.get(this.baseURL + 'band-members/get-prox-events-data',{ headers: headers }).subscribe((response : ServerMessage)=>{
        resolve(response);
      },(error)=>{
        reject(error)
      });
    })
  }
}
