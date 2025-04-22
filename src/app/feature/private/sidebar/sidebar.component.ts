import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { transformChannelData } from './transformer/sidebar-transformer';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelComponent } from '../channel/add-channel/add-channel.component';
import { ChannelService } from '../channel/service/channel.service';
import { ChannelListDatum, Channels } from '../channel/models/channel.interface';
import { ResponseIdentity } from '../../../core/models/interface';
import { ROUTE_CONSTANT } from '../../../core/constants/route.constants';

const {
  channel, home
} = ROUTE_CONSTANT;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  readonly transformChannelData = transformChannelData;

  loading = false;
  destroy$ = new Subject<void>();
  channels: Channels[] | [] = [];
  activeChannelId: number | null = null;

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly channelService: ChannelService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const channelName = params['channelName'];
      this.activeChannelId = channelName ? +channelName : null;
    });

    this.#getRoomList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addChannel(): void {
    const dialogRef = this.dialog.open(AddChannelComponent, {
      width: '320px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.#getRoomList();
      }
    });
  }

  navigateToChannel(channelId: number): void {
    this.activeChannelId = channelId;
    this.router.navigate([home, channel], { queryParams: { channelName: channelId } });
  }

  #getRoomList() {
    this.loading = true;
    this.channelService.getRoomList().pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (response: ResponseIdentity<ChannelListDatum[]>) => {
          this.channels = response.data.map(item => ({
            name: item.name,
            id: item.id
          }));
          this.loading = false;
          if (this.channels.length > 0 && this.activeChannelId === null) {
            this.navigateToChannel(this.channels[0].id);
          }
        },
        error: (error) => {
          console.error('Error fetching room list', error);
          this.loading = false;
        }
      });
  }
}