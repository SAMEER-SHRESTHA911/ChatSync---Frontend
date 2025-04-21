import { Component } from '@angular/core';
import { Router } from '@angular/router';


interface Channel {
  name: string;
  count: number;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  channels: Channel[] = [
    { name: 'general', count: 3 },
    { name: 'development', count: 3 },
    { name: 'design', count: 5 },
    { name: 'marketing', count: 5 }
  ];

  constructor(private router: Router) { }

  addChannel(): void {
    const channelName = prompt('Enter new channel name:');
    if (channelName) {
      this.channels.push({ name: channelName, count: 0 });
    }
  }

  navigateToChannel(channelName: string): void {
    this.router.navigate(['/channel', channelName]);
    console.log(`Navigating to channel: #${channelName}`);
  }

  navigateToDirectMessage(): void {
    this.router.navigate(['/direct-message', 'john-doe']);
    console.log('Navigating to direct messages with John Doe');
  }
}
