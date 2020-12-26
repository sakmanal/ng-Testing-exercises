import { InMemoryDbService, ResponseOptions } from 'angular-in-memory-web-api';
import { Repo } from '../../models/repo';
import { User } from '../../models/user';

export class InMemoryDataService implements InMemoryDbService {
  createDb(): any {
    const repos: Repo[] = [
      {
        name: 'ngMovies',
        description: 'ngMovies is an movie library app made with Angular and using iMDB API to pull movies information.',
        url: 'https://github.com/sakmanal/ngMovies',
        homepage: 'https://repo-1.app',
        id: 1001,
        owner: 'sakmanal',
        stars: 5,
        forks: 1
      },
      {
        name: 'ngNotes',
        description: 'ngNotes is a easy note taking app for android synchronize with GMail.',
        url: 'https://github.com/nikospap/ngNotes',
        homepage: 'https://repo-2.app',
        id: 1002,
        owner: 'nikospap',
        stars: 6,
        forks: 2
      },
      {
        name: 'VideosApp',
        description: 'a YouTube video search application using Angular and RxJS',
        url: 'https://github.com/elisavet16/VideosApp',
        homepage: 'https://repo-3.app',
        id: 1003,
        owner: 'elisavet16',
        stars: 16,
        forks: 4
      },
      {
        name: 'AudioPlayer',
        description: 'AudioPlayer is a compact audio player for Android Smartphone/tablet.',
        url: 'https://github.com/codeman/AudioPlayer',
        homepage: 'https://repo-4.app',
        id: 1004,
        owner: 'codeman',
        stars: 45,
        forks: 7
      },
      {
        name: 'weatherApp',
        description: 'his weather app is one of best free weather apps with full features: Local weather, weather map (weather map service) and weather widgets.',
        url: 'https://github.com/sakmanal/weatherApp',
        homepage: 'https://repo-5.app',
        id: 1005,
        owner: 'codegirl',
        stars: 12,
        forks: 1
      }
    ];

    const users: User[] = [
      {
        id: 4000,
        username: 'Peter',
        email: 'peter@gmail.com',
        jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      }
    ];
    return {repos, users};
  }


  protected responseInterceptor(res: ResponseOptions| any, reqInfo: RequestInfo | any): ResponseOptions {
    if (reqInfo.url === 'api/users' && reqInfo.method === 'post') {
      const {email, password} = reqInfo.req.body;
      if (email === 'john@gmail.com' && password === 'pass') {
        res.body = {
          id: 4001,
          username: 'Jojn',
          email: 'john@gmail.com',
          jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        };
        return res;
      }
      res.body = reqInfo.req.body;
      res.status = 401;
      res.message = 'Wrong Email or Password';
    }
    return res;
  }
}
