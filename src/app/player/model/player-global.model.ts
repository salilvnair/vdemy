import { PlayList } from './playlist.model';
import { CurrentPlayListModel } from './current-playlist.model';
export class PlayerComponentGlobalData {
  playList: PlayList[];
  videoPlayer: HTMLVideoElement;
  currentPlayListModel: CurrentPlayListModel;
  currentVideoCounter: number = 0;
  globalVideoCounter: number = 0;
  fadeOutTimer;
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
