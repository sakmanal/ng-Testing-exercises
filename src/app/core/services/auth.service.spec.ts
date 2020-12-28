import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { RepoRetrieveError } from '@core/models/repoRetrieveError';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  const url = 'api/users';

  const user: User = {
    id: 1234,
    username: 'sakis',
    email: 'sakis@gmail.com',
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('login', () => {
    it('should POST login credentials & return the user from the backend', () => {
      authService.login(user.email, 'secret-pass').subscribe(
        res => expect(res).toEqual(user)
      );

      const req: TestRequest = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      req.flush(user);
      httpTestingController.verify();
    });

    it('should add user to localStorage & emit its value', () => {
      authService.login(user.email, 'secret-pass').subscribe();

      // authService.user$.subscribe((res: User) => {
      //   expect(res.id).toEqual(user.id);
      // });

      const req: TestRequest = httpTestingController.expectOne(url);
      req.flush(user);

      const newUser = JSON.parse(localStorage.getItem('user'));
      expect(newUser).toEqual(user);
      expect(authService.isLoggedIn).toBeTruthy();
      expect(authService.currentUser.id).toBe(user.id);

      httpTestingController.verify();
    });

    it('should handle a login error', () => {
      const error = {
        status: 401,
        statusText: 'unauthorized'
      };
      authService.login(user.email, 'secret-pass').subscribe(
        (res: User) => fail('this should have been an error'),
        (err: RepoRetrieveError) => expect(err.statusText).toBe(error.statusText)
      );

      const req = httpTestingController.expectOne(url);
      spyOn(console, 'error');
      req.flush('Wrong Email or Password', error);

      expect(console.error).toHaveBeenCalled();
      httpTestingController.verify();
    });
  });

  describe('logout', () => {
    it('should remove user from localStrorage & emit null', () => {
      localStorage.setItem('user', JSON.stringify(user));

      authService.logout();

      expect(JSON.parse(localStorage.getItem('user'))).toBeNull();
      expect(authService.isLoggedIn).toBeFalse();
      expect(authService.currentUser).toBeNull();
    });
  });
});
