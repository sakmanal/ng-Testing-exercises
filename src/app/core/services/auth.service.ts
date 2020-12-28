import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RepoRetrieveError } from '@core/models/repoRetrieveError';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User>;
  user$: Observable<User>;

  // URL to web api
  private userUrl = 'api/users';

  get isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  get currentUser(): User {
    return this.userSubject.value;
  }

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('user'))
    );
    this.user$ = this.userSubject.asObservable();
  }

  login(email: string, password: string): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<User>(this.userUrl, { email, password }, { headers })
      .pipe(
        // tap((res) => console.log(res)),
        map((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse): Observable<any> {
    const dataError = new RepoRetrieveError();
    dataError.errorNumber = err.status;
    dataError.statusText = err.statusText;
    dataError.friendlyMessage = err.message;
    console.error(err);
    return throwError(dataError);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
