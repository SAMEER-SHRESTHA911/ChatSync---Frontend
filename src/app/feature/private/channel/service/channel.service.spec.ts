import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChannelService } from './channel.service';
import { baseUrl } from '../../../../environment';
import { API_URL_CONSTANTS } from '../../../../core/constants/api-constants';
import { ResponseIdentity } from '../../../../core/models/interface';
import { ChannelListDatum, CreateRoomPayload } from '../models/channel.interface';

describe('ChannelService', () => {
  let service: ChannelService;
  let httpMock: HttpTestingController;

  const mockApiConstants = {
    rooms: {
      index: 'rooms',
      create: 'create',
      joinRoom: 'join'
    }
  };

  const mockRoomListResponse: ResponseIdentity<ChannelListDatum[]> = {
    data: [{
      id: 1, name: 'Room 1', createdAt: '2025', createdBy: {
        id: 1,
        username: 'Sameer'
      }
    },
    ],
    status: 200,
    message: 'Successful'
  };

  const mockCreateRoomPayload: CreateRoomPayload = { roomName: 'New Room' };
  const mockCreateRoomResponse: ResponseIdentity<ChannelListDatum> = {
    data: {
      id: 1, name: 'Room 1', createdAt: '2025', createdBy: {
        id: 1,
        username: 'Sameer'
      } },
    status: 200,
    message: 'Good'
  };

  const mockJoinLeaveResponse: ResponseIdentity<string> = {
    data: 'Success',
    status: 200,
    message: 'Good'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChannelService,
        { provide: API_URL_CONSTANTS, useValue: mockApiConstants }
      ]
    });

    service = TestBed.inject(ChannelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getRoomList', () => {
    it('should fetch room list', () => {
      service.getRoomList().subscribe(response => {
        expect(response).toEqual(mockRoomListResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockApiConstants.rooms.index}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRoomListResponse);
    });
  });

  describe('createRoom', () => {
    it('should create a room', () => {
      service.createRoom(mockCreateRoomPayload).subscribe(response => {
        expect(response).toEqual(mockCreateRoomResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/${mockApiConstants.rooms.index}/${mockApiConstants.rooms.create}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRoomPayload);
      req.flush(mockCreateRoomResponse);
    });
  });

  describe('joinLeaveRoom', () => {
    it('should join a room', () => {
      service.joinLeaveRoom(true, 1).subscribe(response => {
        expect(response).toEqual(mockJoinLeaveResponse);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/${mockApiConstants.rooms.index}/1/${mockApiConstants.rooms.joinRoom}?join=true`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('join')).toBe('true');
      req.flush(mockJoinLeaveResponse);
    });

    it('should leave a room', () => {
      service.joinLeaveRoom(false, 1).subscribe(response => {
        expect(response).toEqual(mockJoinLeaveResponse);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/${mockApiConstants.rooms.index}/1/${mockApiConstants.rooms.joinRoom}?join=false`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('join')).toBe('false');
      req.flush(mockJoinLeaveResponse);
    });
  });
});