import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { Repo } from '../models/repo';
import { DataService } from '../services/data.service';
import { RepoRetrieveError } from '../models/repoRetrieveError';
import { RouterLinkDirectiveStub } from '../testing/router-link-directive-stub';

import { ReposComponent } from './repos.component';
import { RepoCardComponent } from '../repo-card/repo-card.component';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-repo-search',
  template: '<div></div>',
})
class FakeSearchRepoComponent { }

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
    {
      name: 'repo-3',
      description: 'Angular App 3',
      url: 'https://github.com/elisavet16/repo-3',
      homepage: 'https://repo-3.app',
      id: 1003,
      owner: 'elisavet16',
      stars: 16,
      forks: 4
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        ReposComponent,
        RepoCardComponent,
        FakeSearchRepoComponent,
        RouterLinkDirectiveStub
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // initialize component
    fixture = TestBed.createComponent(ReposComponent);
    component = fixture.componentInstance;

    // mock response
    mockdataService = TestBed.inject(DataService);
    // mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos));
    // spyOn(mockdataService, 'getRepos').and.returnValue(of(testRepos));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the movies from the service', () => {
    mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos));
    fixture.detectChanges();

    expect(mockdataService.getRepos).toHaveBeenCalled();
  });

  describe('ReposComponent Render', () => {
    it('should render a title in an h1 tag', () => {
      mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos));
      fixture.detectChanges();
      const titleElements = fixture.debugElement.queryAll(By.css('h1'));

      expect(titleElements.length).toBe(1);
      expect(titleElements[0].nativeElement.innerHTML).toBe(component.title);
    });

    it('should render all the Github Repos -- create one chip for each repo', () => {
      mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos));
      fixture.detectChanges();
      const reposElements = fixture.debugElement.queryAll(By.css('.chip'));

      expect(reposElements.length).toBe(testRepos.length);
    });

    it('should show the Repos names', () => {
      mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos));
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
      mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos));
      fixture.detectChanges();

      const errorElement = fixture.debugElement.queryAll(By.css('.error'));

      expect(component.repos.length).toBeGreaterThan(0);
      expect(errorElement.length).toBe(0);
    });

    it('should show loading-spinner only while retrieving data', fakeAsync(() => {
      mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos).pipe(delay(500)));
      fixture.detectChanges();

      const spinnerEl1 = fixture.debugElement.queryAll(By.css('.spin'));
      const reposElements1 = fixture.debugElement.queryAll(By.css('.chip'));
      expect(spinnerEl1.length).toBe(1);
      expect(reposElements1.length).toBe(0);
      expect(component.loading).toBeTrue();

      tick(500);
      fixture.detectChanges();

      const spinnerEl2 = fixture.debugElement.queryAll(By.css('.spin'));
      const reposElements2 = fixture.debugElement.queryAll(By.css('.chip'));
      expect(spinnerEl2.length).toBe(0);
      expect(reposElements2.length).toBe(testRepos.length);
      expect(component.loading).toBeFalse();
    }));
  });

  describe('ReposComponent delete', () => {
    it('should remove the indicated repo from the repos card list', () => {
      mockdataService.deleteRepo = jasmine.createSpy().and.returnValue(of(true));
      component.repos = testRepos;

      component.delete(testRepos[1].id);

      expect(component.repos.length).toBe(testRepos.length - 1);
    });

    it('should call deleteRepo', () => {
      mockdataService.deleteRepo = jasmine.createSpy().and.returnValue(of(true));
      component.repos = testRepos;

      component.delete(testRepos[1].id);

      expect(mockdataService.deleteRepo).toHaveBeenCalledWith(testRepos[1].id);
    });
  });

  describe('ReposComponent (deep tests)', () => {
    it('should render each repo as a RepoCardComponent', () => {
      mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos));
      fixture.detectChanges();

      const RepoCardComponentDEs = fixture.debugElement.queryAll(By.directive(RepoCardComponent));
      expect(RepoCardComponentDEs.length).toEqual(testRepos.length);
      for (let i = 0; i < RepoCardComponentDEs.length; i++) {
        expect(RepoCardComponentDEs[i].componentInstance.repo).toEqual(testRepos[i]);
      }
    });

    it(`should call DataService.deleteRepo when the RepoCardComponent's
      delete button is clicked`, () => {
        mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos));
        spyOn(component, 'delete');
        fixture.detectChanges();

        const RepoCardComponentDEs = fixture.debugElement.queryAll(By.directive(RepoCardComponent));
        // (RepoCardComponentDEs[0].componentInstance as RepoCardComponent).delete.emit(undefined);
        RepoCardComponentDEs[0].triggerEventHandler('delete', null);

        expect(component.delete).toHaveBeenCalledWith(testRepos[0].id);
    });

    it('should add a new repo to the repo card-list when the add button is clicked', () => {
      mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos));
      fixture.detectChanges();
      const name = 'ngApp';
      mockdataService.addRepo = jasmine.createSpy().and.returnValue(of({
         ...testRepos[0],
         name,
         id: 1004
      }));
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      const addButton = fixture.debugElement.queryAll(By.css('button'))[1];

      inputElement.value = name;
      addButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      const repoText = fixture.debugElement.query(By.css('.container')).nativeElement.textContent;
      expect(repoText).toContain(name);
    });

    it('should have the correct route for the first repo-card', () => {
      mockdataService.getRepos = jasmine.createSpy().and.returnValue(of(testRepos));
      fixture.detectChanges();
      const RepoCardComponentDEs = fixture.debugElement.queryAll(By.directive(RepoCardComponent));

      const routerLink = RepoCardComponentDEs[0]
        .query(By.directive(RouterLinkDirectiveStub))
        .injector.get(RouterLinkDirectiveStub);

      RepoCardComponentDEs[0].query(By.css('.open')).triggerEventHandler('click', null);

      expect(routerLink.navigatedTo).toBe(`/repos/${testRepos[0].id}`);
    });
  });

});
