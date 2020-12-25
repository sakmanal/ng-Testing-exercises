import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { Repo } from '../models/repo';
import { RepoRetrieveError } from '../models/repoRetrieveError';

describe('DataService Tests', () => {
  let dataService: DataService;
  let httpTestingController: HttpTestingController;
  const reposUrl = 'api/repos';

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

  describe('getRepos', () => {
    it('should GET & return all Repos from the backend', () => {
      dataService.getRepos().subscribe(
        (repos: Repo[]) => {
          expect(repos.length).toBe(testRepos.length);
        }
      );

      // check that one and only one call was made to our endpoint.
      // This will return the request that was made by our service, if any.
      const req: TestRequest = httpTestingController.expectOne(reposUrl);
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

      const req1: TestRequest = httpTestingController.expectOne(reposUrl, 'expected to make an initial request');
      req1.flush('error', retrievalError);

      const req2: TestRequest = httpTestingController.expectOne(reposUrl, 'expected to make a second request');
      req2.flush('error', retrievalError);

      const req3: TestRequest = httpTestingController.expectOne(reposUrl, 'exected to make a third request');
      req3.flush('error', retrievalError);

      httpTestingController.verify();
    });

    it('should return the list of Repos if the backend returns an error 2 times and then succeds', () => {
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

      const req1: TestRequest = httpTestingController.expectOne(reposUrl, 'expected to make an initial request');
      req1.flush('error', retrievalError);

      const req2: TestRequest = httpTestingController.expectOne(reposUrl, 'expected to make a second request');
      req2.flush('error', retrievalError);

      const req3: TestRequest = httpTestingController.expectOne(reposUrl, 'exected to make a third request');
      req3.flush(testRepos);

      httpTestingController.verify();
    });
  });

  describe('searchRepos', () => {
    it('returns empty array if term is blank and doesn\'t make http call', () => {
      dataService.searchRepos('').subscribe(res => {
        expect(res).toEqual([]);
      });

      httpTestingController.expectNone('api/repos/?name=');
      httpTestingController.verify();
    });

    it('returns repos using http GET', () => {
      dataService.searchRepos('app').subscribe(res => {
        expect(res).toEqual(testRepos);
      });

      const req = httpTestingController.expectOne('api/repos/?name=app');
      expect(req.request.method).toEqual('GET');
      req.flush(testRepos);

      httpTestingController.verify();
    });

    it('handles 404 error', () => {
      dataService.searchRepos('app').subscribe(res => {
        expect(res).toEqual([]);
      });

      const req = httpTestingController.expectOne('api/repos/?name=app');

      spyOn(console, 'error');

      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deletRepo', () => {
    const repo = testRepos[1];
    const url = `${reposUrl}/${repo.id}`;

    it('deletes repo with http del', () => {
      dataService.deleteRepo(repo).subscribe(res => {
        expect(res).toEqual(repo);
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(repo);

      httpTestingController.verify();
    });

    it('deletes repo by id with http del', () => {
      dataService.deleteRepo(repo.id).subscribe(res => {
        expect(res).toEqual(repo);
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(repo);

      httpTestingController.verify();
    });

    it('handles 404 error', () => {
      dataService.deleteRepo(repo).subscribe(res => {
        expect(res).toEqual(undefined);
      });

      const req = httpTestingController.expectOne(url);

      spyOn(console, 'error');

      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getRepo', () => {
    const repo = testRepos[1];
    const url = `${reposUrl}/${repo.id}`;

    it('gets repo with http get', () => {
      dataService.getRepo(repo.id).subscribe(res => {
        expect(res).toEqual(repo);
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(repo);

      httpTestingController.verify();
    });

    it('handles 404 error', () => {
      dataService.getRepo(repo.id).subscribe(res => {
        expect(res).toEqual(undefined);
      });

      const req = httpTestingController.expectOne(url);

      spyOn(console, 'error');

      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateRepo', () => {
    const repo = testRepos[1];

    it('updates repo with http put', () => {
      dataService.updateRepo(repo).subscribe(res => {
        expect(res).toEqual(repo);
      });

      const req = httpTestingController.expectOne(reposUrl);
      expect(req.request.method).toEqual('PUT');
      req.flush(repo);

      httpTestingController.verify();
    });

    it('handles 404 error', () => {
      dataService.updateRepo(repo).subscribe(res => {
        expect(res).toBeUndefined();
      });

      const req = httpTestingController.expectOne(reposUrl);

      spyOn(console, 'error');

      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(console.error).toHaveBeenCalled();
    });
  });


  describe('addRepo', () => {
    const repo = { name: 'appMovies', description: 'nice app', id: null, owner: 'sakmanal', stars: 5 };
    it('makes expected calls', () => {
      dataService.addRepo(repo).subscribe(res => {
        expect(res.id).toBe(1007);
      });

      const req = httpTestingController.expectOne(reposUrl);
      expect(req.request.method).toEqual('POST');
      req.flush({...repo, id: 1007});

      httpTestingController.verify();
    });

    it('handles an error', () => {
      dataService.addRepo(repo).subscribe(res => {
        expect(res).toEqual(undefined);
      });

      const req = httpTestingController.expectOne(reposUrl);

      spyOn(console, 'error');

      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(console.error).toHaveBeenCalled();
    });
  });

});
