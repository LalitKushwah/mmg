import { StorageServiceProvider } from './../storage-service/storage-service';
import { HttpClient } from '@angular/common/http';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptorServiceProvider implements HttpInterceptor {

  constructor(public http: HttpClient, private storageService: StorageServiceProvider) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token') != null) {
      req = req.clone({
        setHeaders : {
          Authorization : 'Bearer ' + localStorage.getItem('token')
        }
      });
    }
    return next.handle(req);
  }
}
