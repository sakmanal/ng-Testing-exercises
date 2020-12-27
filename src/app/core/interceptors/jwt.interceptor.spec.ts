import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { JwtInterceptor } from './jwt.interceptor';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
class DataService {
  constructor(private http: HttpClient) { }

  getRepos(): any {
    return this.http.get('api/repos');
  }
}

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let httpTestingController: HttpTestingController;
  let dataService: DataService;

  beforeEach(() => {
    const authServiceStub = {
      currentUser: { jwtToken: 'secret-token' },
      logout: () => ({})
    };
    const routerStub = {
      navigateByUrl: (path: string) => ({})
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DataService,
        JwtInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true,
        },
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: routerStub }
      ]
    });
    interceptor = TestBed.inject(JwtInterceptor);
    dataService = TestBed.inject(DataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('can load instance', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept', () => {
    it('should add an Authorization header', () => {
      dataService.getRepos().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const httpRequest = httpTestingController.expectOne('api/repos');
      expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
      expect(httpRequest.request.headers.get('Authorization')).toBe(
        'Bearer secret-token',
      );
      httpRequest.flush({});

      httpTestingController.verify();
    });

    it('should handle a 401 http error', () => {
      const authServiceStub: AuthService = TestBed.inject(AuthService);
      spyOn(authServiceStub, 'logout');

      const routerStub: Router = TestBed.inject(Router);
      spyOn(routerStub, 'navigateByUrl');

      dataService.getRepos().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const httpRequest = httpTestingController.expectOne('api/repos');
      httpRequest.flush('Error', { status: 401, statusText: 'Unauthorized' });

      expect(authServiceStub.logout).toHaveBeenCalled();
      expect(routerStub.navigateByUrl).toHaveBeenCalledWith('/login');

      httpTestingController.verify();
    });
  });
});
