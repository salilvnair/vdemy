import { PlayList } from '../../../player/model/playlist.model';
export class CourseModel {
  id: number;
  thumbnail: string;
  avatar: string;
  title: string;
  subtitle: string;
  description: string;
  coursePlayList: PlayList[];
}
