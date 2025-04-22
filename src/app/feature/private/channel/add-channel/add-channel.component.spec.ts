import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddChannelComponent } from './add-channel.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ChannelService } from '../service/channel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CreateRoomPayload } from '../models/channel.interface';

describe('AddChannelComponent', () => {
  let component: AddChannelComponent;
  let fixture: ComponentFixture<AddChannelComponent>;
  let channelServiceSpy: jasmine.SpyObj<ChannelService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddChannelComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockResponse = {
    data: { id: 1, name: 'Test Channel' },
    message: 'Channel created'
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    channelServiceSpy = jasmine.createSpyObj('ChannelService', ['createRoom']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AddChannelComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: ChannelService, useValue: channelServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onSubmit', () => {
    it('should do nothing if channelName is empty', () => {
      component.channelName = '   ';
      component.onSubmit();
      expect(channelServiceSpy.createRoom).not.toHaveBeenCalled();
    });

    it('should create channel and close dialog on success', () => {
      component.channelName = 'Test Channel';

      component.onSubmit();

      expect(channelServiceSpy.createRoom).toHaveBeenCalledWith({ roomName: 'Test Channel' } as CreateRoomPayload);
      expect(snackBarSpy.open).toHaveBeenCalledWith('Channel created', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      expect(dialogRefSpy.close).toHaveBeenCalledWith(mockResponse.data);
      expect(component.loading).toBeFalse();
    });
    
    it('should show error snackbar on failure', () => {
      component.channelName = 'Test Channel';
      const error = { error: { message: 'Error creating channel' } };
      channelServiceSpy.createRoom.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(channelServiceSpy.createRoom).toHaveBeenCalledWith({ roomName: 'Test Channel' } as CreateRoomPayload);
      expect(snackBarSpy.open).toHaveBeenCalledWith('Error creating channel', 'Close', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });
  });

  describe('onCancel', () => {
    it('should close dialog', () => {
      component.onCancel();
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  });
});