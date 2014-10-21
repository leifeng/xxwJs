/**
 * Created by chuanlong on 2014/10/20.
 *     anim(lm, {width: '100', height: '50'})
 *     anim(lm, {width: '100', height: '50'}, function () {

    })
 */
'use strict';
define(['xxwOther'], function (other) {
    var animation = function (obj, lists, cb) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            var  flag = true;
            for (var attr in lists) {
                var nowAttr, speed;
                if (attr === 'opacity') {
                    nowAttr = Math.round(parseFloat(other.getStyle(obj, attr)) * 100);
                } else if (attr === 'scrollTop' || attr === 'scrollLeft') {
                    nowAttr = obj[attr];
                } else {
                    nowAttr = parseInt(other.getStyle(obj, attr));
                }
                speed = (lists[attr] - nowAttr) / 8;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                if (nowAttr != lists[attr]) {
                    flag = false;
                }
                if (attr === 'opacity') {
                    obj.style['opacity'] = (nowAttr + speed) / 100;
                    obj.style['filter'] = 'alpha(opacity:' + (nowAttr + speed) + ')';
                } else if (attr === 'scrollTop' || attr === 'scrollLeft') {
                    obj[attr] = nowAttr + speed;
                } else {
                    obj.style[attr] = nowAttr + speed + 'px';
                }
            }
            if (flag) {
                clearInterval(obj.timer);
                if(cb){
                   cb();
                }
              //  cb && cb();
            }
        }, 30);
    };
    return animation;
});