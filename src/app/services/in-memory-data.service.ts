import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Repo } from '../models/repo';

export class InMemoryDataService implements InMemoryDbService {
  createDb(): {repos: Repo[]} {
    const repos: Repo[] = [
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
      {
        name: 'repo-3',
        description: 'Angular App 3',
        url: 'https://github.com/elisavet16/repo-3',
        homepage: 'https://repo-3.app',
        id: 1003,
        owner: 'elisavet16',
        stars: 16,
        forks: 4
      },
      {
        name: 'repo-4',
        description: 'Angular App 4',
        url: 'https://github.com/codeman/repo-4',
        homepage: 'https://repo-4.app',
        id: 1004,
        owner: 'codeman',
        stars: 45,
        forks: 7
      },
      {
        name: 'repo-5',
        description: 'Angular App 5',
        url: 'https://github.com/sakmanal/repo-5',
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
