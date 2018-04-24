import { IPlayList } from '../../../player/model/playlist.model';
export class ICourseModel {
  id: number;
  thumbnail: string;
  avatar: string;
  title: string;
  subtitle: string;
  description: string;
  coursePlayList: IPlayList[];
}
