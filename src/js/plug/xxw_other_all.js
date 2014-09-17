/**
 * Created by chuanlong on 2014/9/17.
 */
'use strict';
define(function () {
    var other = {
        $$: function (obj) {
            if (document.querySelector) {
                return document.querySelector(obj);
            } else {
                return document.getElementById(obj.substring(1));
            }
        },
        bodyW: document.body.clientWidth,
        contentHeight: function () {
            //文档高度
            var ContentHeight = document.body.scrollHeight;
            if (navigator.userAgent.indexOf("Chrome") != -1) {
                ContentHeight = document.body.clientHeight;
            }
            if (navigator.userAgent.indexOf("Firefox") != -1) {
                ContentHeight = document.body.offsetHeight;
            }
            return ContentHeight;
        },
        clientHeight: function getClientHeight() {
            //网页可见高
            var clientHeight = document.body.clientHeight;
            if (navigator.userAgent.indexOf("MSIE 6.0") != -1) {
                clientHeight = document.body.clientHeight;
            }
            else if (navigator.userAgent.indexOf("MSIE") != -1) {
                clientHeight = document.documentElement.offsetHeight
            }
            if (navigator.userAgent.indexOf("Chrome") != -1) {
                clientHeight = document.body.scrollHeight;
            }
            if (navigator.userAgent.indexOf("Firefox") != -1) {
                clientHeight = document.documentElement.scrollHeight;
            }
            return clientHeight;
        },
        mouseScrollStop: function () {
            //禁止滚动
            other.addEvent(document, 'DOMMouseScroll', other.stopDefault);
            other.addEvent(document, 'mousewheel', other.stopDefault)
        },
        mouseScrollStart: function () {
            //取消禁止滚动
            other.removeEvent(document, 'DOMMouseScroll', other.stopDefault);
            other.removeEvent(document, 'mousewheel', other.stopDefault)
        },
        addEvent: function (obj, etype, handle) {
            //绑定事件
            if (obj.addEventListener) {
                obj.addEventListener(etype, handle, false);
            } else if (obj.attachEvent) {
                obj.attachEvent('on' + etype, handle);
            } else {
                obj['on' + etype] = handle;
            }
        },
        removeEvent: function (obj, etype, handle) {
            //移除事件
            if (obj.removeEventListener) {
                obj.removeEventListener(etype, handle, false);
            } else if (obj.detachEvent) {
                obj.detachEvent('on' + etype, handle);
            } else {
                obj['on' + etype] = null;
            }
        },
        fixEvent: function (event) {
            //修正事件
            var originalEvent = event;
            var ev = {
                originalEvent: originalEvent
            };
            var props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which".split(" ");
            for (var i = props.length; i; i--)
                ev[props[i]] = originalEvent[props[i]];
            ev.target = ev.target || ev.srcElement;
            ev.preventDefault = function () {
                if (originalEvent.preventDefault)
                    originalEvent.preventDefault();
                originalEvent.returnValue = false;
            };
            ev.stopPropagation = function () {
                if (originalEvent.stopPropagation)
                    originalEvent.stopPropagation();
                originalEvent.cancelBubble = true;
            };
            if (!ev.relatedTarget && ev.fromElement)
                ev.relatedTarget = ev.fromElement == ev.target ? event.toElement : ev.fromElement;
            if (!ev.which && ((ev.charCode || ev.charCode === 0) ? ev.charCode : ev.keyCode))
                ev.which = ev.charCode || ev.keyCode;
            if (ev.target.nodeType == 3)
                ev.target = ev.target.parentNode;
            if (ev.pageX == null && ev.clientX != null) {
                var doc = document.documentElement, body = document.body;
                ev.pageX = ev.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
                ev.pageY = ev.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
            }
            if (!ev.which && ev.button)
                ev.which = (ev.button & 1 ? 1 : (ev.button & 2 ? 3 : (ev.button & 4 ? 2 : 0)));
            if (!ev.metaKey && ev.ctrlKey)
                ev.metaKey = ev.ctrlKey;
            return ev;
        },
        stopDefault: function (e) {
            e = other.fixEvent(e.event || window.event);
            e.preventDefault();
            e.stopPropagation();
        },
        extend: function (a, b) {
            for (var key in b) {
                a[key] = b[key];
            }
            return a;
        },
        getQuery: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return encodeURI(r[2]);
            return null;
        },
        isMobile: function () {
            return navigator.appVersion.toString().toLowerCase().indexOf('windows') === -1 ? true : false;
        }
    };
    return other;
});