import { Database } from '../../util/tsc-repository/core/nedb';

@Database('courseplayliststatus')
export class CoursePlayListStatusModel {
  playListStatus: PlayListStatusModel[];
  courseId: string;
}
export class PlayListStatusModel {
  playListIndex: number;
  fileIndex: number;
  played: boolean;
}
