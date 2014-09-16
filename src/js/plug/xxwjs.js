/**
 * Created by chuanlong on 2014/8/1.
 */

define(function () {
    var xxw = function (selector, context) {
        return new fn.init(selector, context);
    };
    var fn;
    fn = xxw.prototype = {
        init: function (selector, context) {
            context = context || document;
            if (typeof selector === 'object') {
                this.elements = selector;
            } else {
                if (context.querySelectorAll) {
                    this.elements = context.querySelectorAll(selector);
                } else {
                    this.elements = xxw.Selector(selector);
                }
            }

            return this;
        },
        each: function (handle) {
            if (!this.isObj()) {
                handle.call(this.elements);
            } else {
                var arr;
                if (this.elements instanceof  Array) {
                    arr = this.elements;
                } else {
                    arr = xxw.toArray(this.elements);
                }
                var len = arr.length;
                for (var i = 0; i < len; i++) {
                    handle.call(this.elements[i]);
                }
            }
        },
        on: function (etype, handle) {
            this.each(function () {
                if (this.addEventListener) {
                    this.addEventListener(etype, handle, false);
                } else if (this.attachEvent) {
                    this.attachEvent('on' + etype, handle);
                } else {
                    this['on' + etype] = handle;
                }
            });
            return this;
        },
        off: function (etype, handle) {
            this.each(function () {
                if (this.removeEventListener) {
                    this.removeEventListener(etype, handle, false);
                } else if (this.detachEvent) {
                    this.detachEvent('on' + etype, handle);
                } else {
                    this['on' + etype] = null;
                }
            });
            return this;
        },
        html: function (str) {
            this.each(function () {
                this.innerHTML = str;
            })
        },
        hide: function () {
            this.each(function () {
                this.style.display = 'none'
            })
        },
        text: function (str) {
            this.each(function () {
                this.innerText = str;
                this.textContent = str;
            });
            return this;
        },
        getAttr: function (key) {
            if (!this.isObj()) {
                this.elements.getAttribute(key)
            } else {
                this.elements[0].getAttribute(key);
            }
            return this;
        },
        setAttr: function (key, val) {
            this.each(function () {
                this.setAttribute(key, val)
            });
            return this;
        },
        addChild: function (child) {
            this.each(function () {
                this.appendChild(child);
            });
            return this;
        },
        addClass: function (str) {
            this.each(function () {
                if (this.classList) {
                    this.classList.add(str);
                } else {
                    this.className = str + ' ' + this.className;
                }
            });
            return this;
        },
        delClass: function (str) {
            this.each(function () {
                if (this.classList) {
                    this.classList.remove(str);
                } else {
                    this.className = this.className.replace(str, '');
                }
            });
            return this;
        },
        className: function (str) {
            this.each(function () {
                this.className = str;
            });
            return this;
        },
        css: function (css) {
            this.each(function () {
                this.style.cssText = css;
            });
            return this;
        },
        val: function (str) {
            this.each(function () {
                if (this.nodeName === 'INPUT') {
                    if (typeof str !== 'undefined') {
                        this.value = str;
                    }
                }
            });
        },
        isObj: function () {
            return (typeof this.elements.length !== 'undefined');
        },
        extend: function (a, b) {
            for (var key in b) {
                a[key] = b[key];
            }
        }
    };
    fn.init.prototype = fn;
    xxw.extend=fn.extend;
    //fix Event
    xxw.fixEvent = function (event) {
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
    };
    //ie8 以下选择器
    xxw.Selector = function (selector) {
        var _selector = selector.substring(1);
        var arr = [], i;
        var allElement = document.getElementsByTagName('*');
        if (selector.charAt(0) === '#') {
            arr.push(document.getElementById(_selector));
        } else if (selector.charAt(0) === '.') {
            for (i = 0; i < allElement.length; i++) {
                if (allElement[i].nodeType === 1) {
                    if (allElement[i].className === selector) {
                        arr.concat(allElement[i]);
                    }
                }
            }
        } else {
            for (i = 0; i < allElement.length; i++) {
                if (allElement[i].nodeType === 1) {
                    if (allElement[i].nodeName === selector.toLocaleUpperCase()) {
                        arr.concat(allElement[i]);
                    }
                }
            }
        }
        return arr;
    };
    xxw.toArray = function (s) {
        try {
            return Array.prototype.slice.call(s);
        } catch (e) {
            var arr = [];
            for (var i = 0, len = s.length; i < len; i++) {
                arr[i] = s[i];
            }
            return arr;
        }
    };
    //Array 兼容扩展
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (arr) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === arr) {
                    return i;
                }
            }
            return -1;
        }
    }
    if (!Array.prototype.every) {
        Array.prototype.every = function (fn, obj) {
            if (typeof fn !== 'function') return;
            obj = obj || window;
            for (var i = 0; i < this.length; i++) {
                if (fn.call(obj, this[i], i, this)) {
                    return false;
                }
            }
            return true
        }
    }
    if (!Array.prototype.some) {
        Array.prototype.some = function (fn, obj) {
            if (typeof fn !== 'function') return;
            obj = obj || window;
            for (var i = 0; i < this.length; i++) {
                if (fn.call(obj, this[i], i, this)) {
                    return true;
                }
            }
            return false;
        }
    }
    return xxw;
});