import { Injectable } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../../service/websocket.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

export interface Message {
  messageId?: number; 
  content: string;
  sender: string;
  timestamp: Date;
}

export interface Participant {
  name: string;
  isOnline: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  private messages = new BehaviorSubject<Message[]>([]);
  private participants = new BehaviorSubject<Participant[]>([]);
  private messageReceived = new Subject<Message>();
  private roomId = new BehaviorSubject<number | null>(null);
  private apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private websocketService: WebsocketService,
    private authService: AuthService,
    private router: Router
  ) { }

  setRoomId(roomId: number): void {
    console.log(`Setting room ID to ${roomId}, previous: ${this.roomId.value}`);
    if (this.roomId.value !== roomId) {
      this.cleanup(); // Clean up previous room
      this.roomId.next(roomId);
      this.initializeWebSocketConnection();
    }
  }

  getRoomId(): Observable<number | null> {
    return this.roomId.asObservable();
  }

  private initializeWebSocketConnection(): void {
    const currentRoomId = this.roomId.value;
    if (!currentRoomId || currentRoomId <= 0) {
      console.log('Room ID is invalid or null, cannot initialize WebSocket connection', { currentRoomId });
      return;
    }

    console.log(`Initializing WebSocket connection for room ID ${currentRoomId}`);

    this.websocketService.connect().then(() => {
      console.log('WebSocket connected successfully');
      this.websocketService.joinRoom(currentRoomId);

      this.websocketService.getRoomMessages(currentRoomId).subscribe({
        next: (data) => {
          console.log(`Received message for room ${currentRoomId}:`, data);
          this.handleWebSocketMessage(data);
        },
        error: (err) => {
          console.error(`Error receiving messages for room ${currentRoomId}:`, err);
        }
      });
    }).catch(err => {
      console.error('Failed to connect to WebSocket:', err);
      this.router.navigate(['/login']);
    });

    this.loadMessageHistory();
    this.loadParticipants();
  }

  private handleWebSocketMessage(data: any): void {
    console.log('Handling WebSocket message:', data);

    if (data.data) {
      if (data.message?.includes('joined the room') || data.message?.includes('left the room')) {
        const username = data.data;
        console.log(`Participant update - ${username} ${data.message.includes('joined') ? 'joined' : 'left'}`);
        this.updateParticipantList(username, data.message.includes('joined'));
      } else if (data.message === 'Message sent') {
        console.log('Processing chat message:', data.data);
        const messageData = data.data;
        const message: Message = {
          messageId: messageData.messageId, 
          content: messageData.content,
          sender: messageData.username,
          timestamp: new Date(messageData.timestamp)
        };
        console.log('Formatted message:', message);
        this.addMessage(message);
      } else {
        console.log('Unhandled WebSocket message type:', data.message);
      }
    } else if (data.message?.includes('Failed to')) {
      console.error('Error message from backend:', data.message);
      if (data.message.includes('not authenticated')) {
        this.router.navigate(['/login']);
      }
    } else {
      console.warn('No data in WebSocket message:', data);
    }
  }

  private updateParticipantList(username: string, isJoining: boolean): void {
    console.log(`Updating participant list - ${username} is ${isJoining ? 'joining' : 'leaving'}`);
    const currentParticipants = this.participants.value;

    if (isJoining) {
      if (!currentParticipants.some(p => p.name === username)) {
        const newParticipants = [...currentParticipants, { name: username, isOnline: true }];
        console.log('Added new participant:', newParticipants);
        this.participants.next(newParticipants);
      } else {
        const updatedParticipants = currentParticipants.map(p =>
          p.name === username ? { ...p, isOnline: true } : p
        );
        console.log('Updated participant status to online:', updatedParticipants);
        this.participants.next(updatedParticipants);
      }
    } else {
      const updatedParticipants = currentParticipants.map(p =>
        p.name === username ? { ...p, isOnline: false } : p
      );
      console.log('Updated participant status to offline:', updatedParticipants);
      this.participants.next(updatedParticipants);
    }
  }

  private addMessage(message: Message): void {
    console.log('Adding message to list:', message);
    const currentMessages = this.messages.value;
    if (message.messageId && currentMessages.some(m => m.messageId === message.messageId)) {
      console.log('Duplicate message detected, skipping:', message);
      return;
    }
    const updatedMessages = [...currentMessages, message];
    this.messages.next(updatedMessages);
    this.messageReceived.next(message);
    console.log('Current messages:', updatedMessages);
  }

  private loadMessageHistory(): void {
    const currentRoomId = this.roomId.value;
    if (!currentRoomId || currentRoomId <= 0) {
      console.log('Room ID is invalid or null, cannot load message history', { currentRoomId });
      return;
    }

    const url = `${this.apiUrl}/rooms/${currentRoomId}/messages`;
    console.log(`Constructed URL for message history: ${url}`);

    console.log(`Loading message history for room ${currentRoomId}`);
    this.http.get<{ data: any[], status: number }>(url)
      .pipe(
        map(response => {
          console.log('Message history response:', response);
          return response.data || [];
        }),
        catchError(error => {
          console.error('Error loading message history:', error);
          return of([]);
        })
      )
      .subscribe(messages => {
        const formattedMessages: Message[] = messages.map((msg: any) => ({
          messageId: msg.id, // Include messageId
          content: msg.content,
          sender: msg.user.username,
          timestamp: new Date(msg.timestamp)
        }));
        console.log('Formatted message history:', formattedMessages);
        const currentMessages = this.messages.value;
        const newMessages = formattedMessages.filter(
          msg => !msg.messageId || !currentMessages.some(m => m.messageId === msg.messageId)
        );
        this.messages.next([...currentMessages, ...newMessages]);
      });
  }

  private loadParticipants(): void {
    const currentRoomId = this.roomId.value;
    if (!currentRoomId || currentRoomId <= 0) {
      console.log('Room ID is invalid or null, cannot load participants', { currentRoomId });
      return;
    }

    const url = `${this.apiUrl}/rooms/${currentRoomId}/participants`;
    console.log(`Constructed URL for participants: ${url}`);

    console.log(`Loading participants for room ${currentRoomId}`);
    this.http.get<{ data: any[], status: number }>(url)
      .pipe(
        map(response => {
          console.log('Participants response:', response);
          return response.data || [];
        }),
        catchError(error => {
          console.error('Error loading participants:', error);
          return of([]);
        })
      )
      .subscribe(participants => {
        const formattedParticipants: Participant[] = participants.map((p: any) => ({
          name: p.username,
          isOnline: true
        }));
        console.log('Formatted participants:', formattedParticipants);
        this.participants.next(formattedParticipants);
      });
  }

  getMessages(): Observable<Message[]> {
    console.log('Getting messages observable');
    return this.messages.asObservable();
  }

  onMessageReceived(): Observable<Message> {
    console.log('Getting message received observable');
    return this.messageReceived.asObservable();
  }

  getParticipants(): Observable<Participant[]> {
    console.log('Getting participants observable');
    return this.participants.asObservable();
  }

  onParticipantsUpdated(): Observable<Participant[]> {
    console.log('Getting participants updated observable');
    return this.participants.asObservable();
  }

  sendMessage(message: Message): void {
    const currentRoomId = this.roomId.value;
    if (!currentRoomId || currentRoomId <= 0) {
      console.log('Room ID is invalid or null, cannot send message', { currentRoomId });
      return;
    }

    console.log(`Sending message for room ${currentRoomId}:`, message);
    this.websocketService.sendMessage(currentRoomId, message.content);
  }

  joinRoom(): void {
    const currentRoomId = this.roomId.value;
    if (!currentRoomId || currentRoomId <= 0) {
      console.log('Room ID is invalid or null, cannot join room', { currentRoomId });
      return;
    }

    const url = `${this.apiUrl}/rooms/${currentRoomId}/join?join=true`;
    console.log(`Constructed URL for joining room: ${url}`);

    console.log(`Joining room ${currentRoomId} via REST API`);
    this.http.get<{ status: number }>(url)
      .pipe(
        catchError(error => {
          console.error('Error joining room via REST API:', error);
          return of(null);
        })
      )
      .subscribe(response => {
        console.log('Join room response:', response);
      });
  }

  leaveRoom(): void {
    const currentRoomId = this.roomId.value;
    if (!currentRoomId || currentRoomId <= 0) {
      console.log('Room ID is invalid or null, cannot leave room', { currentRoomId });
      return;
    }

    console.log(`Leaving room ${currentRoomId} via WebSocket`);
    this.websocketService.leaveRoom(currentRoomId);

    const url = `${this.apiUrl}/rooms/${currentRoomId}/join?join=false`;
    console.log(`Constructed URL for leaving room: ${url}`);

    console.log(`Leaving room ${currentRoomId} via REST API`);
    this.http.get<{ status: number }>(url)
      .pipe(
        catchError(error => {
          console.error('Error leaving room via REST API:', error);
          return of(null);
        })
      )
      .subscribe(response => {
        console.log('Leave room response:', response);
      });
  }

  cleanup(): void {
    console.log('Cleaning up ChatRoomService');
    const currentRoomId = this.roomId.value;
    if (currentRoomId) {
      this.leaveRoom();
    }
    this.messages.next([]);
    this.participants.next([]);
    this.roomId.next(null);
    console.log('Cleanup complete');
  }
}