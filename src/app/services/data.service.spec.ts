import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import { Repo } from '../models/repo';
import { RepoRetrieveError } from '../models/repoRetrieveError';

describe('DataService Tests', () => {
  let dataService: DataService;
  let httpTestingController: HttpTestingController;

  const testRepos: Repo[] = [
    {
      name: 'repo-1',
      description: 'Angular App 1',
      url: 'https://github.com/sakmanal/repo-1',
      homepage: 'https://repo-1.app',
      id: 1001
    },
    {
      name: 'repo-2',
      description: 'Angular App 2',
      url: 'https://github.com/sakmanal/repo-2',
      homepage: 'https://repo-2.app',
      id: 1001
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });

    dataService = TestBed.inject(DataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(dataService).toBeTruthy();
  });

  it('should GET & return all Repos from the backend', () => {
    dataService.getRepos().subscribe(
      (repos: Repo[]) => {
        expect(repos.length).toBe(testRepos.length);
      }
    );

    // check that one and only one call was made to our endpoint.
    // This will return the request that was made by our service, if any.
    const req: TestRequest = httpTestingController.expectOne(environment.reposUrl);
    // check the HTTP method of this request to make sure it’s a GET
    expect(req.request.method).toEqual('GET');

    req.flush(testRepos);
    // verify() method to make sure that there are no pending HTTP calls.
    // make sure that we don’t do more requests than we expect to
    // or that we don’t have any unhandled requests.
    httpTestingController.verify();
  });

  it('should return a RepoRetrieveError if the backend returns an error 3 times in a row', () => {
    const retrievalError = {
      status: 500,
      statusText: 'Server Error'
    };
    dataService.getRepos()
      .subscribe(
        (data: Repo[]) => fail('this should have been an error'),
        (err: RepoRetrieveError) => {
          expect(err.errorNumber).toEqual(retrievalError.status);
          expect(err.message).toEqual(retrievalError.statusText);
        }
      );

    const req1: TestRequest = httpTestingController.expectOne(environment.reposUrl, 'expected to make an initial request');
    req1.flush('error', retrievalError);

    const req2: TestRequest = httpTestingController.expectOne(environment.reposUrl, 'expected to make a second request');
    req2.flush('error', retrievalError);

    const req3: TestRequest = httpTestingController.expectOne(environment.reposUrl, 'exected to make a third request');
    req3.flush('error', retrievalError);

    httpTestingController.verify();
  });

  it('should return the list of Repos if the backend returns an error 2 times and the succeds', () => {
    const retrievalError = {
      status: 500,
      statusText: 'Server Error'
    };
    dataService.getRepos()
    .subscribe(
      (repos: Repo[]) => {
        expect(repos.length).toBe(testRepos.length);
        repos.forEach( (r, index) => {
          expect(r.id).toBe(testRepos[index].id);
        });
      },
      (err: RepoRetrieveError) => {
        fail('we should not get an error');
      }
    );

    const req1: TestRequest = httpTestingController.expectOne(environment.reposUrl, 'expected to make an initial request');
    req1.flush('error', retrievalError);

    const req2: TestRequest = httpTestingController.expectOne(environment.reposUrl, 'expected to make a second request');
    req2.flush('error', retrievalError);

    const req3: TestRequest = httpTestingController.expectOne(environment.reposUrl, 'exected to make a third request');
    req3.flush(testRepos);

    httpTestingController.verify();
  });

});
