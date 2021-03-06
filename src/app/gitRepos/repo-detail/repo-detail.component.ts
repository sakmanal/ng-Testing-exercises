import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '@core/services/data.service';
import { Repo } from '@core/models/repo';

@Component({
  selector: 'app-repo-detail',
  templateUrl: './repo-detail.component.html',
  styleUrls: ['./repo-detail.component.css'],
})
export class RepoDetailComponent implements OnInit {
  repo: Repo;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getRepo();
  }

  getRepo(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.dataService.getRepo(id)
      .subscribe(repo => this.repo = repo);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.dataService.updateRepo(this.repo)
      .subscribe(() => this.goBack());
  }

}
