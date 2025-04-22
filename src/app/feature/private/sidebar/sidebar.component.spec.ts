import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChannelService } from '../channel/service/channel.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ResponseIdentity } from '../../../core/models/interface';
import { ChannelListDatum } from '../channel/models/channel.interface';
import { ROUTE_CONSTANT } from '../../../core/constants/route.constants';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let channelServiceSpy: jasmine.SpyObj<ChannelService>;
  let routeSpy: { queryParams: any };

  const mockResponse: ResponseIdentity<ChannelListDatum[]> = {
    data: [{ id: 1, name: 'Channel 1', createdAt: '', createdBy: { id: 1, username: 'user' } },], status: 200, message: ''
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    channelServiceSpy = jasmine.createSpyObj('ChannelService', ['getRoomList']);
    routeSpy = { queryParams: of({ channelName: '1' }) };

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ChannelService, useValue: channelServiceSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: ROUTE_CONSTANT, useValue: { home: 'home', channel: 'channel' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    channelServiceSpy.getRoomList.and.returnValue(of(mockResponse));
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set activeChannelId and fetch room list', () => {
      expect(component.activeChannelId).toBe(1);
      expect(channelServiceSpy.getRoomList).toHaveBeenCalled();
      expect(component.channels).toEqual([{ id: 1, name: 'Channel 1' }]);
    });
  });

  describe('addChannel', () => {
    it('should open dialog and refresh room list on close with result', () => {
      dialogSpy.open.and.returnValue({ afterClosed: () => of({ id: 2, name: 'Channel 2' }) } as any);
      component.addChannel();
      expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
        width: '320px',
        panelClass: 'custom-dialog-container'
      });
      expect(channelServiceSpy.getRoomList).toHaveBeenCalled();
    });
  });

  describe('navigateToChannel', () => {
    it('should set activeChannelId and navigate', () => {
      component.navigateToChannel(2);
      expect(component.activeChannelId).toBe(2);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['home', 'channel'], { queryParams: { channelName: 2 } });
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$', () => {
      const destroySpy = spyOn(component.destroy$, 'complete');
      component.ngOnDestroy();
      expect(destroySpy).toHaveBeenCalled();
    });
  });
});