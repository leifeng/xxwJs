/**
 * Created by zcl on 14-9-16.
 */
define(function(){
    var cookie = {
        get: function (key) {
            var _cookie = document.cookie;
            if (_cookie.length > 0) {
                var start = _cookie.indexOf(key + '=');
                if (start != -1) {
                    var begin = key.length + 1;
                    var end = _cookie.indexOf(";", begin);
                    if (end === -1) end = _cookie.length;
                    return encodeURI(_cookie.substring(begin, end));
                }
                return null;
            }
        },
        set: function (key, val, time) {
            var ExpireDate = new Date();
            ExpireDate.setTime(ExpireDate.getTime() + (time * 24 * 3600 * 1000));
            document.cookie = key + '=' + decodeURI(val) + ';expires=' + (time == null ? '' : ExpireDate.toUTCString()) + ';';
        },
        del: function (key) {
            if (this.get(key)) {
                document.cookie = key + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
            }
        }
    };
    return cookie;
})