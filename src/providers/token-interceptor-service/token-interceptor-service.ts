import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import  'rxjs/add/operator/do';
import {App} from "ionic-angular";
import {CONSTANTS} from "../../utils/constants";
import {SessionExpiredPage} from "../../pages/session-expired/session-expired";


@Injectable()
export class TokenInterceptorServiceProvider implements HttpInterceptor {

  constructor (private app: App) {
  }

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token') != null) {
      req = req.clone({
        setHeaders : {
          Authorization : 'Bearer ' + localStorage.getItem('token')
        }
      });
    }
    return next.handle(req).do((event: HttpEvent<any>) => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === CONSTANTS.TOKEN_EXPIRED) {
            // Remove invalid token
            localStorage.removeItem('token');
            // redirect user to Login page
            this.app.getActiveNav().setRoot(SessionExpiredPage);
          }
        }
      });
  }
}
