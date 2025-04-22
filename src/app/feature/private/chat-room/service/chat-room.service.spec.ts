import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatRoomService, Message, Participant } from './chat-room.service';
import { WebsocketService } from '../../service/websocket.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ChatRoomService', () => {
  let service: ChatRoomService;
  let httpMock: HttpTestingController;
  let websocketServiceSpy: jasmine.SpyObj<WebsocketService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockMessage: Message = {
    messageId: 1,
    content: 'Hello',
    sender: 'user1',
    timestamp: new Date()
  };
  const mockParticipant: Participant = { name: 'user1', isOnline: true };

  beforeEach(() => {
    websocketServiceSpy = jasmine.createSpyObj('WebsocketService', ['connect', 'joinRoom', 'leaveRoom', 'sendMessage', 'getRoomMessages']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChatRoomService,
        { provide: WebsocketService, useValue: websocketServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(ChatRoomService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('setRoomId', () => {
    it('should set roomId and initialize WebSocket', () => {
      websocketServiceSpy.connect.and.returnValue(Promise.resolve(true));
      websocketServiceSpy.getRoomMessages.and.returnValue(of({}));
      service.setRoomId(1);
      expect(websocketServiceSpy.connect).toHaveBeenCalled();
      expect(websocketServiceSpy.joinRoom).toHaveBeenCalledWith(1);
    });
  });

  describe('getMessages', () => {
    it('should return messages observable', () => {
      service.getMessages().subscribe(messages => {
        expect(messages).toEqual([]);
      });
    });
  });

  describe('getParticipants', () => {
    it('should return participants observable', () => {
      service.getParticipants().subscribe(participants => {
        expect(participants).toEqual([]);
      });
    });
  });

  describe('sendMessage', () => {
    it('should send message via WebSocket', () => {
      service.setRoomId(1);
      service.sendMessage(mockMessage);
      expect(websocketServiceSpy.sendMessage).toHaveBeenCalledWith(1, mockMessage.content);
    });
  });

  describe('joinRoom', () => {
    it('should call join room API', () => {
      service.setRoomId(1);
      service.joinRoom();
      const req = httpMock.expectOne('http://localhost:8080/rooms/1/join?join=true');
      expect(req.request.method).toBe('GET');
      req.flush({ status: 200 });
    });
  });

  describe('cleanup', () => {
    it('should clear state and leave room', () => {
      service.setRoomId(1);
      service.cleanup();
      expect(websocketServiceSpy.leaveRoom).toHaveBeenCalledWith(1);
      service.getMessages().subscribe(messages => expect(messages).toEqual([]));
      service.getParticipants().subscribe(participants => expect(participants).toEqual([]));
    });
  });
});