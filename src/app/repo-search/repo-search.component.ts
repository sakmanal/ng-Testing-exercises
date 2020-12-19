import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Repo } from '../models/repo';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-repo-search',
  templateUrl: './repo-search.component.html',
  styleUrls: ['./repo-search.component.css']
})
export class RepoSearchComponent implements OnInit {
  repos$: Observable<Repo[]>;
  private searchTerms = new Subject<string>();
  spin: boolean;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.repos$ = this.searchTerms.pipe(
      tap((term) => {
        if (term) {
          this.spin = true;
        }
      }),

      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.dataService.searchRepos(term).
          pipe(
            finalize(() => this.spin = false)
          )),
    );
  }

    // Push a search term into the observable stream.
    search(term: string): void {
      this.searchTerms.next(term);
    }

}
