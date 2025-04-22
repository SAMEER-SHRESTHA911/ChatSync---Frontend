import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectChannelLoading } from '../store/channel.selector';
import { CreateRoomPayload } from '../models/channel.interface';
import { createRoom } from '../store/channel.actions';
import { ChannelService } from '../service/channel.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss'
})
export class AddChannelComponent {
  channelName: string = '';
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<AddChannelComponent>,
    private channelService: ChannelService,
    private snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void { 
  }

  onSubmit(): void {
    const trimmed = this.channelName.trim();
    if (!trimmed) return;

    this.loading = true;
    const payload: CreateRoomPayload = { roomName: trimmed };

    this.channelService.createRoom(payload).subscribe({
      next: (response) => {
        this.snackBar.open(response.message || 'Channel created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.dialogRef.close(response.data);
      },
      error: (error) => {
        this.snackBar.open(
          error?.error?.message || 'Something went wrong while creating the channel.',
          'Close',
          { duration: 4000, horizontalPosition: 'right', verticalPosition: 'top' }
        );
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
