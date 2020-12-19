import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataService } from '../services/data.service';
import { RepoSearchComponent } from './repo-search.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterLinkDirectiveStub } from '../testing/router-link-directive-stub';
import { RouterTestingModule } from '@angular/router/testing';

describe('RepoSearchComponent', () => {
  let component: RepoSearchComponent;
  let fixture: ComponentFixture<RepoSearchComponent>;

  beforeEach(async(() => {
    const dataServiceStub = () => ({ searchRepos: (term: string) => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ RepoSearchComponent, RouterLinkDirectiveStub ],
      providers: [{ provide: DataService, useFactory: dataServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call search method on input keyup Event', () => {
      spyOn(component, 'search');

      // Run the compnent lifecycle and update HTML
      fixture.detectChanges();

      const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = 'app';

      // if we have (keyup)="search(searchBox.value)" on our HTML input Element
      // we dispatch it on our test with input.dispatchEvent(new Event('keyup'));
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.search).toHaveBeenCalledWith('app');
  });

  it('starts with an empty list', () => {
    // Run the compnent lifecycle and update HTML
    fixture.detectChanges();

    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map(a => a.nativeElement);

    expect(links.length).toBe(0);
  });

  it('Typing on the input box doesn\'t change the list for 299ms', fakeAsync(() => {
    // Trigger the lifecycle
    fixture.detectChanges();

    // Setup our dependencies
    const dataServiceStub: DataService = TestBed.inject(DataService);
    spyOn(dataServiceStub, 'searchRepos').and.returnValue(
      of([ { name: 'appMovies', description: 'nice app', id: 1001, owner: 'sakmanal', stars: 5 }])
    );

    // Action
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    // tick(300) should throw an error which is good, it means debounceTime(300) works as expected
    tick(299);
    // Update HTML
    fixture.detectChanges();

    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map(a => a.nativeElement);

    expect(links.length).toBe(0);

    // Prevent Error: 1 periodic timer(s) still in the queue.
    discardPeriodicTasks();
  }));

  it('The list of matching heroes appears after 300ms', fakeAsync(() => {
    fixture.detectChanges(); // Trigger the lifecycle
    const dataServiceStub: DataService = TestBed.inject(DataService);

    spyOn(dataServiceStub, 'searchRepos').and.returnValue(
      of([
        { name: 'MovApp', description: 'nice app', id: 1001, owner: 'sakmanal', stars: 5 },
        { name: 'MovPlayer', description: 'nice app', id: 1002, owner: 'sakmanal', stars: 5 }
      ])
    );

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'Mov';
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();
    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map(a => a.nativeElement);
    expect(links.length).toBe(2);

    expect(links[0].textContent).toContain('MovApp');
    expect(links[1].textContent).toContain('MovPlayer');
  }));

  it('Can perform multiple searches in a row - 300ms apart', fakeAsync(() => {
    // Trigger the lifecycle
    fixture.detectChanges();
    const dataServiceStub: DataService = TestBed.inject(DataService);

    spyOn(dataServiceStub, 'searchRepos').and.callFake(term => {
      return of(
        [
          { name: 'MovApp', description: 'nice app', id: 1001, owner: 'sakmanal', stars: 5 },
          { name: 'MovPlayer', description: 'nice app', id: 1002, owner: 'sakmanal', stars: 5 },
          { name: 'ngApp', description: 'nice app', id: 1003, owner: 'sakmanal', stars: 5 }
        ]
        .filter(repo => repo.name.includes(term))
      );
    });

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    // Search for the first time
    input.value = 'Mov';
    input.dispatchEvent(new Event('input'));
    tick(300);

    // Narrow the search
    input.value = 'MovA';
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();

    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map(a => a.nativeElement);

    expect(links.length).toBe(1);
    expect(links[0].textContent).toContain('MovApp');
    expect(links[0].getAttribute('href')).toBe('/repos/1001');
  }));

  it('Doesn\'t perform a search if the search term doesn\'t change', fakeAsync(() => {
    // Trigger the lifecycle
    fixture.detectChanges();
    const dataServiceStub: DataService = TestBed.inject(DataService);

    spyOn(dataServiceStub, 'searchRepos').and.callFake(term => {
      return of(
        [
          { name: 'MovApp', description: 'nice app', id: 1001, owner: 'sakmanal', stars: 5 },
          { name: 'MovPlayer', description: 'nice app', id: 1002, owner: 'sakmanal', stars: 5 },
          { name: 'ngApp', description: 'nice app', id: 1003, owner: 'sakmanal', stars: 5 }
        ]
        .filter(repo => repo.name.includes(term))
      );
    });

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;

    // Search for the first time
    input.value = 'Mov';
    input.dispatchEvent(new Event('input'));
    tick(300);

    // Trigger the input's change event again
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();

    expect(dataServiceStub.searchRepos).toHaveBeenCalledTimes(1);
  }));

});
