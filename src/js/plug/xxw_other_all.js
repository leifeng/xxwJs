/**
 * Created by chuanlong on 2014/9/17.
 */

define(function () {
    'use strict';
    var other = {
        $$: function (obj) {
            if (document.querySelector) {
                return document.querySelector(obj);
            } else {
                return document.getElementById(obj.substring(1));
            }
        },
        clientWidth: function () {
            return document.documentElement.clientWidth || document.body.clientWidth;
        },
        clientHeight: function () {
            return document.documentElement.clientHeight || document.body.clientHeight;
        },
        scrollTop: function () {
            return document.documentElement.scrollTop || document.body.scrollTop;
        },
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
        mouseScrollStop: function () {
            //禁止滚动
            other.addEvent(document, 'DOMMouseScroll', other.stopDefault);
            other.addEvent(document, 'mousewheel', other.stopDefault);
        },
        mouseScrollStart: function () {
            //取消禁止滚动
            other.removeEvent(document, 'DOMMouseScroll', other.stopDefault);
            other.removeEvent(document, 'mousewheel', other.stopDefault);
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
                ev.relatedTarget = ev.fromElement === ev.target ? event.toElement : ev.fromElement;
            if (!ev.which && ((ev.charCode || ev.charCode === 0) ? ev.charCode : ev.keyCode))
                ev.which = ev.charCode || ev.keyCode;
            if (ev.target.nodeType === 3)
                ev.target = ev.target.parentNode;
            if (ev.pageX === null && ev.clientX !== null) {
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
            //停止冒泡
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
            if (r !== null) return encodeURI(r[2]);
            return null;
        },
        getStyle: function (obj, attr) {
            //获取样式
            var style = window.getComputedStyle(obj, null) ? window.getComputedStyle(obj, null) : obj.currentStyle;
            if (style.getPropertyValue) {
                return style.getPropertyValue(attr);
            } else {
                return style.getAttribute(attr);
            }
        },
        getChilds: function (parent) {
            //获取子元素
            var childs = parent.childNodes;
            var arr = [];
            for (var i = 0; i < childs.length; i++) {
                if (childs[i].nodeType === 1) {
                    arr.push(childs[i]);
                }
            }
            return arr;
        },
        getClass: function (parent, cls) {
            var oAll = parent.getElementsByTagName('*');
            var arr = [];
            for (var i = 0; i < oAll.length; i++) {
                if (oAll[i].className === cls) {
                    arr.push(oAll[i]);
                }
            }
            return arr;
        },
        goTo:function(url){
            var a=document.getElementById('xxw_href');
            if(!a){
                a=document.createElement('a');
                a.id='xxw_href';
                a.style.display='none';
                a.target='_blank';
                document.body.appendChild(a);
            }
            a.setAttribute('href',url);
            if(document.all){
                a.click();
            }else{
                var ev=document.createEvent('HTMLEvents');
                ev.initEvent('click',false,true);
                a.dispatchEvent(ev);
            }
        },
        isMobile: function () {
            return navigator.appVersion.toString().toLowerCase().indexOf('windows') === -1 ? true : false;
        }
    };
    return other;
});