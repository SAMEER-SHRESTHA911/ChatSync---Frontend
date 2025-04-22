import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../../../environment';
import { API_URL_CONSTANTS } from '../../../../core/constants/api-constants';
import { Observable } from 'rxjs';
import { ResponseIdentity } from '../../../../core/models/interface';
import { ChannelListDatum, CreateRoomPayload } from '../models/channel.interface';

const {
  rooms: { 
    index, create, joinRoom
  }
} = API_URL_CONSTANTS;

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http: HttpClient) { }
  
  getRoomList() : Observable<ResponseIdentity<ChannelListDatum[]>>{ 
    return this.http.get<ResponseIdentity<ChannelListDatum[]>>(`${baseUrl}/${index}`);
  }

  createRoom(payload: CreateRoomPayload): Observable<ResponseIdentity<ChannelListDatum>>{
    return this.http.post<ResponseIdentity<ChannelListDatum>>(`${baseUrl}/${index}/${create}`, payload);
  }

  joinLeaveRoom(join: boolean, roomId:number): Observable<ResponseIdentity<string>> { 
    const params = new HttpParams().set(
      'join', join
    )
    return this.http.get<ResponseIdentity<string>>(`${baseUrl}/${index}/${roomId}/${joinRoom}`, { params });
  }
}
