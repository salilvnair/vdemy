import { PlayList } from './playlist.model';
import { CurrentPlayListModel } from './current-playlist.model';
import { Subscription } from 'rxjs/Subscription';
export class PlayerComponentGlobalData {
  playList: PlayList[];
  videoPlayer: HTMLVideoElement;
  currentPlayListModel: CurrentPlayListModel;
  currentVideoCounter: number = 0;
  globalVideoCounter: number = 0;
  fadeOutTimer: any = 0;
  initToggler = false;
  playerVolume: number = 0;
  playbackRate: number = 1;
  currentVolumeBarFill: string;
  totalVideoDuration: number;
  btnFileBeingViewedId: string;
  iconFileBeingViewedId: string;
  currentFileName: string = '';
  staticHtml: string = '';
  isCurrentFileHtml = false;
}
