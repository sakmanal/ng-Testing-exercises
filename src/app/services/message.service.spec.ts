import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have no messages to start', () => {
    expect(service.messages).toEqual([]);
    expect(service.messages.length).toBe(0);
  });

  it('should add a message when add is called', () => {
    service.add('test message');

    expect(service.messages.length).toBe(1);
    expect(service.messages).toEqual(['test message']);
  });

  it('should remove all messages when clear is called', () => {
    service.add('test message');
    service.clear();

    expect(service.messages.length).toBe(0);
    expect(service.messages).toEqual([]);
  });

  it('should return all messages when getlogs is called', () => {
    service.messages = ['log1', 'log2'];
    const logs = service.getlogs();

    expect(logs.length).toEqual(2);
  });
});
