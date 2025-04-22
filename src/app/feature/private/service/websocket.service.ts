import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

export interface ChatMessage {
  userId: number;
  roomId: number;
  message: string;
}

export interface ActionMessage {
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client: Client | null = null;
  private state: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private roomMessagesSubject: Map<number, Subject<any>> = new Map(); 
  private subscriptions: Map<number, StompSubscription> = new Map();
  private connectionPromise: Promise<boolean> | null = null;
  private isBrowser: boolean;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 3000;
  private shouldReconnect = true;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private authService: AuthService,
    private router: Router
  ) {
    (window as any).global = window;
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.initializeClient();
      this.authService.onLogout().subscribe(() => {
        console.log('Logout detected, disconnecting WebSocket');
        this.disconnect();
      });
    }
  }

  private initializeClient() {
    (window as any).global = window;
    this.client = new Client();
    this.client.webSocketFactory = () => new (SockJS as any)('http://localhost:8080/ws');

    this.client.onConnect = () => {
      console.log('WebSocket connection established');
      this.state.next(true);
      this.reconnectAttempts = 0;
    };

    this.client.onDisconnect = () => {
      console.log('WebSocket connection closed');
      this.state.next(false);
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error frame:', frame);
      console.error('STOMP error message:', frame.headers?.['message']);
      console.error('STOMP error headers:', frame.headers);
    };

    this.client.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  public connect(): Promise<boolean> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    console.log('Connecting to WebSocket');
    this.connectionPromise = new Promise<boolean>((resolve, reject) => {
      if (this.client?.connected) {
        resolve(true);
        return;
      }

      const subscription = this.state.subscribe(connected => {
        if (connected) {
          subscription.unsubscribe();
          resolve(true);
        }
      });

      this.client?.activate();
    }).catch(err => {
      console.error('WebSocket connection failed:', err);
      if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connectionPromise = null;
        return new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(this.connect()), this.reconnectDelay);
        });
      } else {
        console.error('Max reconnect attempts reached or reconnection disabled. Redirecting to login.');
        this.router.navigate(['/login']);
        throw err;
      }
    });

    return this.connectionPromise;
  }

  public disconnect(): void {
    this.shouldReconnect = false;
    this.client?.deactivate();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
    this.roomMessagesSubject.clear();
    this.connectionPromise = null;
    this.reconnectAttempts = 0;
    console.log('WebSocket disconnected and subscriptions cleared');
  }

  public isConnected(): Observable<boolean> {
    return this.state.asObservable();
  }

  public joinRoom(roomId: number): void {
    this.connect().then(() => {
      const userId = this.authService.getUserId();
      if (!userId) {
        console.error('Cannot join room: userId not found. Please log in.');
        this.router.navigate(['/login']);
        return;
      }
      console.log(`Joining room ${roomId} via WebSocket with userId: ${userId}`);
      const actionMessage: ActionMessage = { userId: Number(userId) };
      this.client?.publish({
        destination: `/app/join_room/${roomId}`,
        body: JSON.stringify(actionMessage)
      });
      this.subscribeToRoom(roomId);
    }).catch(err => {
      console.error(`Failed to join room ${roomId}:`, err);
    });
  }

  public leaveRoom(roomId: number): void {
    if (this.client?.connected) {
      const userId = this.authService.getUserId();
      if (!userId) {
        console.error('Cannot leave room: userId not found. Please log in.');
        this.router.navigate(['/login']);
        return;
      }
      console.log(`Leaving room ${roomId} via WebSocket with userId: ${userId}`);
      const actionMessage: ActionMessage = { userId: Number(userId) };
      this.client.publish({
        destination: `/app/leave_room/${roomId}`,
        body: JSON.stringify(actionMessage)
      });
      this.unsubscribeFromRoom(roomId);
    } else {
      console.warn(`Cannot leave room ${roomId}: WebSocket not connected`);
    }
  }

  public sendMessage(roomId: number, content: string): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('Cannot send message: userId not found. Please log in.');
      this.router.navigate(['/login']);
      return;
    }

    const message: ChatMessage = {
      userId: Number(userId),
      roomId: roomId,
      message: content
    };

    this.connect().then(() => {
      console.log(`Sending message to room ${roomId}: ${content}, userId: ${userId}`);
      this.client?.publish({
        destination: `/app/send_message/${roomId}`,
        body: JSON.stringify(message)
      });
    }).catch(err => {
      console.error(`Failed to send message to room ${roomId}:`, err);
    });
  }

  private subscribeToRoom(roomId: number): void {
    if (!this.roomMessagesSubject.has(roomId)) {
      const subject = new Subject<any>();
      this.roomMessagesSubject.set(roomId, subject);
      const subscription = this.client?.subscribe(`/topic/room/${roomId}`, (message: IMessage) => {
        if (message.body) {
          const parsedMessage = JSON.parse(message.body);
          console.log(`Received message for room ${roomId}:`, parsedMessage);
          subject.next(parsedMessage);
        }
      });
      if (subscription) {
        this.subscriptions.set(roomId, subscription);
        console.log(`Subscribed to room ${roomId}`);
      }
    }
  }

  private unsubscribeFromRoom(roomId: number): void {
    const subscription = this.subscriptions.get(roomId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(roomId);
      console.log(`Unsubscribed from room ${roomId}`);
    }
    this.roomMessagesSubject.delete(roomId);
  }

  public getRoomMessages(roomId: number): Observable<any> {
    if (!this.roomMessagesSubject.has(roomId)) {
      this.subscribeToRoom(roomId);
    }
    return this.roomMessagesSubject.get(roomId)!.asObservable();
  }
}