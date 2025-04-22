import { TestBed } from '@angular/core/testing';
import { WebsocketService } from './websocket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Client, StompSubscription } from '@stomp/stompjs';
import { PLATFORM_ID } from '@angular/core';

describe('WebsocketService', () => {
  let service: WebsocketService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId'], { onLogout: of() });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        WebsocketService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(WebsocketService);
  });

  describe('connect', () => {
    it('should connect and activate client', async () => {
      const clientSpy = jasmine.createSpyObj('Client', ['activate', 'connected']);
      clientSpy.connected = false;
      (service as any).client = clientSpy;

      const promise = service.connect();
      (service as any).state.next(true); 
      await promise;

      expect(clientSpy.activate).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should deactivate client and clear subscriptions', () => {
      const clientSpy = jasmine.createSpyObj('Client', ['deactivate']);
      (service as any).client = clientSpy;
      service.disconnect();
      expect(clientSpy.deactivate).toHaveBeenCalled();
      expect((service as any).shouldReconnect).toBeFalse();
    });
  });

  describe('joinRoom', () => {
    it('should publish join message if connected', async () => {
      authServiceSpy.getUserId.and.returnValue('1');
      const clientSpy = jasmine.createSpyObj('Client', ['publish', 'connected']);
      clientSpy.connected = true;
      (service as any).client = clientSpy;
      spyOn(service, 'connect').and.returnValue(Promise.resolve(true));

      service.joinRoom(1);
      await Promise.resolve();

      expect(clientSpy.publish).toHaveBeenCalledWith({
        destination: '/app/join_room/1',
        body: JSON.stringify({ userId: 1 })
      });
    });
  });

  describe('sendMessage', () => {
    it('should publish message if connected', async () => {
      authServiceSpy.getUserId.and.returnValue('1');
      const clientSpy = jasmine.createSpyObj('Client', ['publish', 'connected']);
      clientSpy.connected = true;
      (service as any).client = clientSpy;
      spyOn(service, 'connect').and.returnValue(Promise.resolve(true));

      service.sendMessage(1, 'Hello');
      await Promise.resolve();

      expect(clientSpy.publish).toHaveBeenCalledWith({
        destination: '/app/send_message/1',
        body: JSON.stringify({ userId: 1, roomId: 1, message: 'Hello' })
      });
    });
  });

  describe('getRoomMessages', () => {
    it('should subscribe to room and return observable', () => {
      const clientSpy = jasmine.createSpyObj('Client', ['subscribe']);
      (service as any).client = clientSpy;
      clientSpy.subscribe.and.returnValue({ unsubscribe: () => { } } as StompSubscription);

      const observable = service.getRoomMessages(1);
      expect(clientSpy.subscribe).toHaveBeenCalledWith('/topic/room/1', jasmine.any(Function));
      expect(observable).toBeInstanceOf(Observable);
    });
  });
});