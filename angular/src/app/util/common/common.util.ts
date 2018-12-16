import * as CommonUtilConstant from './common.constant';

export class CommonUtility {
  static detectBrowser = () => {
    if (
      (navigator.userAgent.indexOf('Opera') ||
        navigator.userAgent.indexOf('OPR')) != -1
    ) {
      return CommonUtilConstant.USER_AGENT_OPERA;
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
      return CommonUtilConstant.USER_AGENT_CHROME;
    } else if (navigator.userAgent.indexOf('Safari') != -1) {
      return CommonUtilConstant.USER_AGENT_SAFARI;
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
      return CommonUtilConstant.USER_AGENT_FIREFOX;
    } else if (CommonUtility.detectIE()) {
      return CommonUtilConstant.USER_AGENT_IE;
    } else {
      return CommonUtilConstant.USER_AGENT_UNKNOWM;
    }
  };
  static detectIE = () => {
    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      // alert(parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10));
      return true;
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      // var rv = ua.indexOf('rv:');
      //console.log(parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10));
      return true;
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      // console.log(parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10));
      return true;
    }

    // other browser
    return false;
  };
  static deepEqual = (x, y) => {
    if (x === y) {
      return true;
    } else if (
      typeof x == 'object' &&
      x != null &&
      (typeof y == 'object' && y != null)
    ) {
      if (Object.keys(x).length != Object.keys(y).length) return false;

      for (var prop in x) {
        if (y.hasOwnProperty(prop)) {
          if (!CommonUtility.deepEqual(x[prop], y[prop])) return false;
        } else return false;
      }

      return true;
    } else return false;
  };

  static getFileExtension = (fullFileName: string) => {
    //console.log('before',fullFileName);
    //console.log('after',fullFileName.split('.').pop());
    return fullFileName.split('.').pop();
  };
}
