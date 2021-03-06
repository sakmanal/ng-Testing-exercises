import { Component, OnInit } from '@angular/core';
import { DataService } from '@core/services/data.service';
import { Repo } from '@core/models/repo';
import { RepoRetrieveError } from '../../core/models/repoRetrieveError';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css']
})
export class ReposComponent implements OnInit {

  // repos$: Observable<Repo[]>;
  repos: Repo[];
  error: RepoRetrieveError;
  loading: boolean;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // this.repos$ = this.dataService.getRepos()
    //   .pipe(
    //     catchError((error: RepoRetrieveError) => {
    //        this.error = error;
    //        return of([]);
    //     })
    //   );
    this.loading = true;
    this.dataService.getRepos().subscribe(
      (repos) => this.repos = repos,
      (error) => this.error = error,
      () => this.loading  = false
    );
  }

  add(name: string): void {
    name = name.trim();
    const newRepo: Repo = {
      name,
      description: 'New Angular App',
      id: null,
      owner: 'user',
      stars: 0
    };
    if (!name) { return; }
    this.dataService.addRepo(newRepo)
      .subscribe(repo => {
        this.repos.push(repo);
      });
  }

  delete(repoId: number): void {
    /* not working, calls getRepos and then removes the selected repo */
    // this.repos$ = this.repos$.pipe(
    //   map( repos => repos.filter( r => r.id !== repoId))
    // );
    this.repos = this.repos.filter(r => r.id !== repoId);
    this.dataService.deleteRepo(repoId).subscribe();
  }

}
