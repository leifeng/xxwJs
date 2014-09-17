/**
 * Created by chuanlong on 2014/8/1.
 */
'use strict';
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
            return a;
        }
    };
    fn.init.prototype = fn;
    xxw.extend=fn.extend;
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