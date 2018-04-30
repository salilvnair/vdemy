import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { PlayList } from '../model/playlist.model';

@Injectable()
export class PlayerDataService {
  private playListMetaDataSubject = new Subject<PlayList[]>();
  setPlayListMetaData(playList: PlayList[]) {
    this.playListMetaDataSubject.next(playList);
  }
  getPlayListMetaData() {
    return this.playListMetaDataSubject.asObservable();
  }
}
