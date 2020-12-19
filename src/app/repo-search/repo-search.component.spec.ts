import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataService } from '../services/data.service';
import { RepoSearchComponent } from './repo-search.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('RepoSearchComponent', () => {
  let component: RepoSearchComponent;
  let fixture: ComponentFixture<RepoSearchComponent>;
  let mockdataService: DataService;

  beforeEach(async(() => {
    const dataServiceStub = () => ({ searchRepos: (term: string) => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ RepoSearchComponent ],
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

  describe('ngOnInit', () => {
    // it('should makes expected calls', () => {
    //   const dataServiceStub: DataService = fixture.debugElement.injector.get(
    //     DataService
    //   );
    //   spyOn(dataServiceStub, 'searchRepos').and.callThrough();

    //   component.ngOnInit();

    //   expect(mockdataService.searchRepos).toHaveBeenCalled();
    // });

    it('starts with an empty list', () => {
      // Run the compnent lifecycle and update HTML
      fixture.detectChanges();

      const links: Array<HTMLAnchorElement> = fixture.debugElement
        .queryAll(By.css('a'))
        .map(a => a.nativeElement);

      expect(links.length).toBe(0);
    });
  });
});
