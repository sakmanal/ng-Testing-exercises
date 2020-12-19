import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { Repo } from '../models/repo';
import { RepoRetrieveError } from '../models/repoRetrieveError';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // URL to web api
  private reposUrl = 'api/repos';

  constructor(private http: HttpClient) {}

  /** GET repos from the server */
  getRepos(): Observable<Repo[]> {
    return this.http.get<Repo[]>(this.reposUrl).pipe(
      retry(2),
      tap(repos => this.log(`fetched Github Repos`)),
      catchError(this.handleError)
    );
  }

  getReposNames(): Observable<{ name: string; id: number }[]> {
    return this.getRepos().pipe(
      map((repos) =>
        repos.map(
          (r: Repo) =>
            ({
              name: r.name,
              id: r.id,
            } as Repo)
        )
      )
    );
  }

  /** GET repo by id. */
  getRepo(id: number): Observable<Repo> {
    const url = `${this.reposUrl}/${id}`;
    return this.http.get<Repo>(url).pipe(
      tap(_ => this.log(`fetched repo id=${id}`)),
      catchError(this.handleError)
    );
  }

  /* GET repos whose name contains search term */
  searchRepos(term: string): Observable<Repo[]> {
    if (!term.trim()) {
      // if not search term, return empty repo array.
      return of([]);
    }
    return this.http.get<Repo[]>(`api/repos/?name=${term}`).pipe(
      tap(_ => this.log(`found repos matching "${term}"`)),
      catchError(this.handleError)
    );
  }

  /** DELETE: delete the repo from the server */
  deleteRepo(repo: Repo | number): Observable<Repo> {
    const id = typeof repo === 'number' ? repo : repo.id;
    const url = `${this.reposUrl}/${id}`;

    return this.http.delete<Repo>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted repo id=${id}`)),
      catchError(this.handleError)
    );
  }

  /** PUT: update the repo on the server */
  updateRepo(repo: Repo): Observable<any> {
    return this.http.put(this.reposUrl, repo, httpOptions).pipe(
      tap(_ => this.log(`updated repo id=${repo.id}`)),
      catchError(this.handleError)
    );
  }

    /** POST: add a new repo to the server */
    addRepo(repo: Repo): Observable<Repo> {
      return this.http.post<Repo>(this.reposUrl, repo, httpOptions).pipe(
        tap((r: Repo) => this.log(`added repo w/ id=${r.id}`)),
        catchError(this.handleError)
      );
    }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError(error: HttpErrorResponse): Observable<any> {
    const dataError = new RepoRetrieveError();
    dataError.errorNumber = error.status;
    dataError.message = error.statusText;
    dataError.friendlyMessage = 'An error occurred retrieving data.';
    return throwError(dataError);
  }

  /** Log a DataService message with the MessageService */
  private log(message: string): void {

  }
}
