import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Repo } from '../models/repo';

export class InMemoryDataService implements InMemoryDbService {
  createDb(): {repos: Repo[]} {
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
    return {repos};
  }
}
