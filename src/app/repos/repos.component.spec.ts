import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { Repo } from '../models/repo';
import { DataService } from '../services/data.service';
import { RepoRetrieveError } from '../models/repoRetrieveError';

import { ReposComponent } from './repos.component';
import { RepoCardComponent } from '../repo-card/repo-card.component';

describe('ReposComponent', () => {
  let component: ReposComponent;
  let fixture: ComponentFixture<ReposComponent>;
  let mockdataService: DataService;

  const testRepos: Repo[] = [
    {
      name: 'repo-1',
      description: 'Angular App 1',
      url: 'https://github.com/sakmanal/repo-1',
      homepage: 'https://repo-1.app',
      id: 1001,
      owner: 'sakmanal',
      stars: 5,
      forks: 1
    },
    {
      name: 'repo-2',
      description: 'Angular App 2',
      url: 'https://github.com/nikospap/repo-2',
      homepage: 'https://repo-2.app',
      id: 1002,
      owner: 'nikospap',
      stars: 6,
      forks: 2
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ReposComponent, RepoCardComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // initialize component
    fixture = TestBed.createComponent(ReposComponent);
    component = fixture.componentInstance;

    // mock response
    mockdataService = TestBed.inject(DataService);
    mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos));
    // spyOn(mockdataService, 'getRepos').and.returnValue(of(testRepos));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the movies from the service', () => {
    fixture.detectChanges();
    expect(mockdataService.getRepos).toHaveBeenCalled();
  });

  it('should render a title in an h1 tag', () => {
    fixture.detectChanges();
    const titleElements = fixture.debugElement.queryAll(By.css('h1'));

    expect(titleElements.length).toBe(1);
    expect(titleElements[0].nativeElement.innerHTML).toBe(component.title);
  });

  it('should render all the Github Repos', () => {
    fixture.detectChanges();
    const reposElements = fixture.debugElement.queryAll(By.css('.chip'));

    expect(reposElements.length).toBe(testRepos.length);
  });

  it('should show the Repos names', () => {
    fixture.detectChanges();
    const reposElements = fixture.debugElement.queryAll(By.css('.chip'));

    reposElements.forEach((repoElement: DebugElement, index) => {
      expect(repoElement.nativeElement.innerHTML).toContain(testRepos[index].name);
    });
  });

  it('should show an error if getting the repos fail', () => {
    const error: RepoRetrieveError = {
      errorNumber: 500,
      message: 'Server Error',
      friendlyMessage: 'An error occurred retrieving data.'
    };
    mockdataService.getRepos = jasmine.createSpy().and.returnValue(throwError(error));

    fixture.detectChanges();
    const errorElement = fixture.debugElement.queryAll(By.css('.error'));

    expect(errorElement.length).toBe(1);
    expect(errorElement[0].nativeElement.innerHTML).toContain(error.friendlyMessage);
  });

  it('should not show an error if getting the repos succeeds', () => {
    fixture.detectChanges();

    const errorElement = fixture.debugElement.queryAll(By.css('.error'));
    expect(errorElement.length).toBe(0);
  });


});
