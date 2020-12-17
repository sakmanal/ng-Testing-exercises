import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Repo } from '../models/repo';
import { RepoRetrieveError } from '../models/repoRetrieveError';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css']
})
export class ReposComponent implements OnInit {

  repos$: Observable<Repo[]>;
  error: RepoRetrieveError;
  title = 'My Github Repos';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.repos$ = this.dataService.getRepos()
      .pipe(
        catchError((error: RepoRetrieveError) => {
           this.error = error;
           return of([]);
        })
      );
  }

  delete(repoId: number): void {
    this.repos$ = this.repos$.pipe(
      map( repos => repos.filter( r => r.id !== repoId))
    );
    // this.heroService.deleteHero(hero).subscribe();
  }

}
