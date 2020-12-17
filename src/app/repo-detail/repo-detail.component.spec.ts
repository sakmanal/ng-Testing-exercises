import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { DataService } from '../services/data.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepoDetailComponent } from './repo-detail.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';


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
