import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RepoCardComponent } from './repo-card.component';

describe('RepoCardComponent', () => {
  let component: RepoCardComponent;
  let fixture: ComponentFixture<RepoCardComponent>;
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
    TestBed.configureTestingModule({
      declarations: [ RepoCardComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct repo', () => {
    fixture.componentInstance.repo = testRepo;

    expect(fixture.componentInstance.repo.id).toEqual(testRepo.id);
  });

  it('should render the repo name in an anchor tag', () => {
    fixture.componentInstance.repo = testRepo;
    fixture.detectChanges();

    const deA = fixture.debugElement.query(By.css('b'));
    expect(deA.nativeElement.textContent).toContain(testRepo.name);
    // expect(fixture.nativeElement.querySelector('b').textContent).toContain(testRepo.name);
  });

});
