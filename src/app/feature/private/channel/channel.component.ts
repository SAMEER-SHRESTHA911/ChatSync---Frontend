import { Component, Input } from '@angular/core';
import { ChannelData } from './models/channel.interface';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {

  @Input({ required: true }) channelData!: ChannelData;
}
