import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, shareReplay, tap } from 'rxjs/operators';
import { Repo } from '../models/repo';
import { RepoRetrieveError } from '../models/repoRetrieveError';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getRepos(): Observable<Repo[]> {
    return this.http.get<any>(environment.reposUrl)
      .pipe(
        retry(2),
        map( repos =>
          repos.map( (r: any) => ({
             name: r.name,
             description: r.description || 'no description found',
             url: r.html_url,
             homepage: r.homepage || 'no homepage found',
             id: r.id
          } as Repo))
        ),
        // shareReplay(1),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<RepoRetrieveError> {
    const dataError = new RepoRetrieveError();
    dataError.errorNumber = error.status;
    dataError.message = error.statusText;
    dataError.friendlyMessage = 'An error occurred retrieving data.';
    return throwError(dataError);
  }
}
