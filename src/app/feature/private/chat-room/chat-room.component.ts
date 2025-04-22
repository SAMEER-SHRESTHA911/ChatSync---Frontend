import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatRoomService, Message, Participant } from './service/chat-room.service';
import { AuthService } from '../../../core/services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)',
        opacity: 1,
      })),
      state('out', style({
        transform: 'translateX(100%)',
        opacity: 0,
        display: 'none'
      })),
      transition('in => out', [
        animate('200ms ease-in-out')
      ]),
      transition('out => in', [
        animate('200ms ease-in-out')
      ]),
    ]),
  ],
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  roomId: number | null = null;
  messages: Message[] = [];
  participants: Participant[] = [];
  newMessage: string = '';
  showParticipants: boolean = false;
  private subscriptions: Subscription = new Subscription();
  private shouldScrollToBottom: boolean = false;

  constructor(
    private chatRoomService: ChatRoomService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        const channelName = params['channelName'];
        const parsedRoomId = channelName ? +channelName : null;

        if (parsedRoomId && !isNaN(parsedRoomId)) {
          console.log(`Navigating to roomId: ${parsedRoomId}`);
          this.roomId = parsedRoomId;
          this.chatRoomService.setRoomId(parsedRoomId);
          this.initializeRoom();
        } else {
          console.error('Invalid room ID:', channelName);
          this.router.navigate(['/home']);
        }
      })
    );
  }

  private initializeRoom(): void {
    this.chatRoomService.cleanup();
    this.messages = [];
    this.participants = [];

    this.chatRoomService.joinRoom();

    this.subscriptions.add(
      this.chatRoomService.getMessages().subscribe(messages => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
      })
    );

    this.subscriptions.add(
      this.chatRoomService.getParticipants().subscribe(participants => {
        this.participants = participants;
      })
    );

    this.subscriptions.add(
      this.chatRoomService.onMessageReceived().subscribe(message => {
        // this.messages.push({
        //   content: message.content,
        //   sender: message.sender,
        //   timestamp: new Date(message.timestamp)
        // });
        this.shouldScrollToBottom = true;
      })
    );
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  toggleParticipants(): void {
    this.showParticipants = !this.showParticipants;
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.roomId) {
      const message: Message = {
        content: this.newMessage,
        sender: this.authService.getUserId() || 'Anonymous',
        timestamp: new Date(),
      };
      this.chatRoomService.setRoomId(this.roomId);
      this.chatRoomService.sendMessage(message);
      this.newMessage = '';
      this.shouldScrollToBottom = true;
    }
  }

  closeParticipantsPanel(): void {
    this.showParticipants = false;
  }

  ngOnDestroy(): void {
    this.chatRoomService.cleanup();
    this.subscriptions.unsubscribe();
  }
}