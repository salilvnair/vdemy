import { NeDBRepository } from '@salilvnair/jsxpa';

export class LoginRepo extends NeDBRepository {
  // below method decides name of the file name where nedb will store the data
  // so basically it is a database file or a table name
  databaseName() {
    return "login";
  }
}
