import { PlayList } from '../../../player/model/playlist.model';
export class CourseModel {
  id: number;
  thumbnail: string;
  avatar: string;
  title: string;
  subtitle: string;
  description: string;
  playListTotalFileCount?: number;
  playListTotalVideoDuration?: number;
  coursePlayList: PlayList[];
}
