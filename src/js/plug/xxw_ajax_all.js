/**
 * Created by zcl on 14-9-16.
 */
'use strict';
define(['xxw'], function (xxw) {
    var ajax = function (options, cb) {
        var xmlHttp;
        var defaults = {
                data: null,
                url: '',
                method: 'get',
                async: false

            }
            , _data = ''
            , _method
            , _uri;
        xxw.extend(defaults, options);
        _method = defaults.method.toLocaleUpperCase();
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
            if (xmlHttp.overrideMimeType) {
                xmlHttp.overrideMimeType('text/xml');
            }
        } else {
            try {
                xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
        }
        if (!xmlHttp) {
            alert("XMLHttpRequest对象创建失败!");
            return;
        }
        if (defaults.data) {
            if (typeof defaults.data === "object") {
                for (var key in defaults.data) {
                    _data += key + '=' + defaults.data[key] + '&';
                }
                _data = _data.substring(0, _data.length - 1);
            }
        }
        if (_method === 'GET') {
            _uri = defaults.url + '?' + _data;
        } else {
            _uri = defaults.url;
        }
        xmlHttp.open(_method, _uri, defaults.async);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                cb(xmlHttp.responseText);
            } else {
                cb(xmlHttp.status);
            }
        };
        if (_method === 'GET') {
            xmlHttp.send(null);
        } else {
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttp.send(_data)
        }

    };
    return  ajax;
});