import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { DataService } from '../../core/services/data.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepoDetailComponent } from './repo-detail.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Repo } from '../../core/models/repo';


describe('RepoDetailComponent', () => {
  let component: RepoDetailComponent;
  let fixture: ComponentFixture<RepoDetailComponent>;
  let mockActivatedRoute: any;
  let mockdataService: DataService;
  let mockLocation: Location;
  const testRepo = {
    name: 'repo-1',
    description: 'Angular App 1',
    url: 'https://github.com/sakmanal/repo-1',
    homepage: 'https://repo-1.app',
    id: 1001,
    owner: 'sakmanal',
    stars: 5,
    forks: 1
  };

  beforeEach(async(() => {
    mockLocation = jasmine.createSpyObj(['back']);

    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => '3'}}
    };
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      declarations: [ RepoDetailComponent ],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: Location, useValue: mockLocation},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoDetailComponent);
    component = fixture.componentInstance;

    mockdataService = TestBed.inject(DataService);
    mockdataService.getRepo = jasmine.createSpy().and.returnValue(of(testRepo));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render repo name in a h2 tag', () => {
    fixture.detectChanges();

    const deA = fixture.debugElement.query(By.css('h2'));
    expect(deA.nativeElement.textContent).toContain(testRepo.name.toUpperCase());
  });

  it('should call updateRepo when save is called', fakeAsync(() => {
    mockdataService.updateRepo = jasmine.createSpy().and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    flush();

    expect(mockdataService.updateRepo).toHaveBeenCalled();
  }));

});

describe('RepoDetailComponent Altenative (complete)', () => {
  let component: RepoDetailComponent;
  let fixture: ComponentFixture<RepoDetailComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: { paramMap: { get: () => ({}) } }
    });
    const locationStub = () => ({ back: () => ({}) });
    const dataServiceStub = () => ({
      getRepo: (id: number) => ({ subscribe: f => f({}) }),
      updateRepo: (repo: Repo) => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RepoDetailComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Location, useFactory: locationStub },
        { provide: DataService, useFactory: dataServiceStub }
      ]
    });
    fixture = TestBed.createComponent(RepoDetailComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getRepo').and.callThrough();
      component.ngOnInit();
      expect(component.getRepo).toHaveBeenCalled();
    });
  });

  describe('getRepo', () => {
    it('makes expected calls', () => {
      const dataServiceStub: DataService = fixture.debugElement.injector.get(
        DataService
      );
      spyOn(dataServiceStub, 'getRepo').and.callThrough();
      component.getRepo();
      expect(dataServiceStub.getRepo).toHaveBeenCalled();
    });
  });

  describe('goBack', () => {
    it('makes expected calls', () => {
      const locationStub: Location = fixture.debugElement.injector.get(
        Location
      );
      spyOn(locationStub, 'back').and.callThrough();
      component.goBack();
      expect(locationStub.back).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('makes expected calls', () => {
      const dataServiceStub: DataService = fixture.debugElement.injector.get(
        DataService
      );
      spyOn(component, 'goBack').and.callThrough();
      spyOn(dataServiceStub, 'updateRepo').and.callThrough();
      component.save();
      expect(component.goBack).toHaveBeenCalled();
      expect(dataServiceStub.updateRepo).toHaveBeenCalled();
    });
  });

  describe('initialized without a repo', () => {
    it('Doesn\'t display anything', () => {
      const dataServiceStub = TestBed.inject(DataService);
      spyOn(dataServiceStub, 'getRepo').and.returnValue(of(undefined));
      fixture.detectChanges();
      const anyDiv = fixture.debugElement.query(By.css('div'));
      expect(anyDiv).toBeFalsy();
    });
  });

  describe('initialized with a repo', () => {
    beforeEach(() => {
      const dataServiceStub = TestBed.inject(DataService);
      spyOn(dataServiceStub, 'getRepo').and.returnValue(
        of({
          name: 'repo-1',
          description: 'Angular App 1',
          url: 'https://github.com/sakmanal/repo-1',
          homepage: 'https://repo-1.app',
          id: 1001,
          owner: 'sakmanal',
          stars: 5,
          forks: 1
        })
      );
      fixture.detectChanges();
    });


    it('Displays content when initialized with a repo', () => {
      const anyDiv = fixture.debugElement.query(By.css('div'));
      expect(anyDiv).toBeTruthy();
    });

    it('Has header with repo name in uppercase', () => {
      const header: HTMLHeadingElement = fixture.debugElement.query(
        By.css('h2')
      ).nativeElement;
      expect(header.textContent).toContain('REPO-1 Details');
    });

    it('Shows repo id', () => {
      const div: HTMLDivElement = fixture.debugElement.query(
        By.css('div div') // first inner div
      ).nativeElement;
      expect(div.textContent).toContain('id: 1001');
    });

    it('Has input box with the repo name', async () => {
      // Since the input box is bound using [(ngModel)] we have to wait
      // for the component to become stable.
      await fixture.whenStable();
      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      expect(input.value).toBe('repo-1');
    });

    it('Has textarea box with the repo description', async () => {
      // Since the input box is bound using [(ngModel)] we have to wait
      // for the component to become stable.
      await fixture.whenStable();
      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('textarea')
      ).nativeElement;
      expect(input.value).toBe('Angular App 1');
    });

    it('Calls location.back() when go back button is clicked', () => {
      const locationStub = TestBed.inject(Location);
      spyOn(locationStub, 'back');
      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('.back')
      ).nativeElement;
      button.click();
      expect(locationStub.back).toHaveBeenCalled();
    });

    it('Updates repo property when user types on the input', () => {
      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      input.value = 'ngCode';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.repo.name).toBe('ngCode');
    });

    it('Updates repo then goes back when save button is clicked', () => {
      const dataServiceStub = TestBed.inject(DataService);
      spyOn(dataServiceStub, 'updateRepo').and.returnValue(of(undefined));
      const locationStub = TestBed.inject(Location);
      spyOn(locationStub, 'back');
      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('.save')
      ).nativeElement;
      button.click();
      expect(dataServiceStub.updateRepo).toHaveBeenCalledWith(component.repo);
      expect(locationStub.back).toHaveBeenCalled();
    });

  });

});
