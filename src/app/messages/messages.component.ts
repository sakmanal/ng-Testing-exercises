import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  logs: string[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.logs = this.messageService.getlogs();
  }

  clear(): void {
    this.logs = [];
    this.messageService.clear();
  }

}
