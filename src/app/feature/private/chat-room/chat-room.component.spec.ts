import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRoomComponent } from './chat-room.component';
import { ChatRoomService } from './service/chat-room.service';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChatRoomComponent', () => {
  let component: ChatRoomComponent;
  let fixture: ComponentFixture<ChatRoomComponent>;
  let chatRoomServiceSpy: jasmine.SpyObj<ChatRoomService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeSpy: { queryParams: any };

  beforeEach(async () => {
    chatRoomServiceSpy = jasmine.createSpyObj('ChatRoomService', ['setRoomId', 'joinRoom', 'cleanup', 'sendMessage', 'getMessages', 'getParticipants', 'onMessageReceived']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeSpy = { queryParams: of({ channelName: '1' }) };

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ChatRoomComponent],
      providers: [
        { provide: ChatRoomService, useValue: chatRoomServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatRoomComponent);
    component = fixture.componentInstance;
    chatRoomServiceSpy.getMessages.and.returnValue(of([]));
    chatRoomServiceSpy.getParticipants.and.returnValue(of([]));
    chatRoomServiceSpy.onMessageReceived.and.returnValue(of({ content: 'test', sender: 'user', timestamp: new Date() }));
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set roomId and initialize room', () => {
      expect(component.roomId).toBe(1);
      expect(chatRoomServiceSpy.setRoomId).toHaveBeenCalledWith(1);
      expect(chatRoomServiceSpy.joinRoom).toHaveBeenCalled();
    });
  });

  describe('sendMessage', () => {
    it('should send message and clear input', () => {
      component.roomId = 1;
      component.newMessage = 'Hello';
      authServiceSpy.getUserId.and.returnValue('user1');

      component.sendMessage();

      expect(chatRoomServiceSpy.sendMessage).toHaveBeenCalledWith(jasmine.objectContaining({
        content: 'Hello',
        sender: 'user1'
      }));
      expect(component.newMessage).toBe('');
    });
  });

  describe('toggleParticipants', () => {
    it('should toggle showParticipants', () => {
      component.showParticipants = false;
      component.toggleParticipants();
      expect(component.showParticipants).toBeTrue();
      component.toggleParticipants();
      expect(component.showParticipants).toBeFalse();
    });
  });

  describe('ngOnDestroy', () => {
    it('should cleanup and unsubscribe', () => {
      component.ngOnDestroy();
      expect(chatRoomServiceSpy.cleanup).toHaveBeenCalled();
    });
  });
});