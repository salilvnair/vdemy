export class JsonCommonUtil {
  static removeEmptyValues = obj => {
    Object.keys(obj).forEach(key => obj[key] == '' && delete obj[key]);
  };
  static removeNullValues = obj => {
    Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
  };
  static removeNEValues = obj => {
    Object.keys(obj).forEach(
      key => (obj[key] == null || obj[key] == '') && delete obj[key]
    );
  };
}
