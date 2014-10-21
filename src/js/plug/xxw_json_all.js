/**
 * Created by chuanlong on 2014/9/17.
 *
 * xxw.json({
     url:'http://domain.com',
     data:{arg:'test'}
        },function(data){
            console.log(data)
   })
 *
 *
 */

define(['xxw'], function (xxw) {
    'use strict';
    var json = function (options, cb) {
        var defaults = {
            url: '',
            data: ''
        };
        xxw.extend(defaults, options);
        var ra = Math.floor(Math.random() * 100000);
        var cbName = '_$xxwJson_callback_' + ra;
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        if (head) {
            head.appendChild(script);
        } else {
            document.body.appendChild(script);
        }
        var _data = '';
        if (defaults.data) {
            if (typeof defaults.data === "object") {
                for (var key in defaults.data) {
                    _data += key + '=' + defaults.data[key] + '&';
                }
                _data = _data.substring(0, _data.length - 1);
            }
        }
        window[cbName] = function (_data) {
            cb(_data);
            setTimeout(function () {
                delete window[cbName];
                script.parentNode.removeChild(script);
            }, 100);

        };
        script.src = defaults.url + '?callback=' + cbName + '&' + _data;
    };
    return  json;
});