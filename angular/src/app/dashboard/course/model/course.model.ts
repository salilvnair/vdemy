import { PlayList } from '../../../player/model/playlist.model';
import { Database } from "@salilvnair/ngpa";

@Database('course')
export class CourseModel {
  //@Id({ SEQ_TABLE_NAME: 'seq_course' }) //will be implemented soon
  _id: string;
  thumbnail: string;
  avatar: string;
  title: string;
  subtitle: string;
  description: string;
  playListTotalFileCount?: number;
  playListTotalVideoDuration?: number;
  coursePlayList: PlayList[];
}
