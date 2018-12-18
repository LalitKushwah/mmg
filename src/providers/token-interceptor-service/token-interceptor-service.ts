import { HttpErrorResponse } from '@angular/common/http';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { App } from "ionic-angular";
import { LoginPage } from "../../pages/login/login";
import { CONSTANTS } from "../../pages/utils/constants";

import  'rxjs/add/operator/do';

@Injectable()
export class TokenInterceptorServiceProvider implements HttpInterceptor {

  constructor(public app: App) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token') != null) {
      req = req.clone({
        setHeaders : {
          Authorization : 'Bearer ' + localStorage.getItem('token')
        }
      });
    }

    return next.handle(req).do(() => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === CONSTANTS.TOKEN_EXPIRED) {
            // Remove invalid token
            localStorage.removeItem('token');
            // redirect user to login page
            this.app.getActiveNav().push(LoginPage)
          }
        }
      });
  }
}
