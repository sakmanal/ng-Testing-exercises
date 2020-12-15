import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'addressbook';

  constructor(private dataService: DataService) {
    this.dataService.getRepos().subscribe(
      x => console.log(x)
    )
  }
}
