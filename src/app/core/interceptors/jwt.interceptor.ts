import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const currentUser = this.authService.currentUser;
    const isLoggedIn = currentUser && currentUser.jwtToken;
    const isApiUrl = request.url.startsWith('api/repos');
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.jwtToken}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        // in case of 401 http error
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.authService.logout();
          this.router.navigateByUrl('/login');
          return throwError(err);
        }
        return throwError(err);
      })
    );
  }
}
