import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Repo } from '../models/repo';

@Component({
  selector: 'app-repo-card',
  templateUrl: './repo-card.component.html',
  styleUrls: ['./repo-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepoCardComponent {

  @Input() repo: Repo;
  @Output() delete = new EventEmitter();

  constructor() { }

  onDeleteClick($event): void {
    $event.stopPropagation();
    this.delete.next();
  }

}
