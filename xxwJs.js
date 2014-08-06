/**
 * Created by chuanlong on 2014/8/1.
 */
;
(function () {
    var xxw = (function () {
        var xxw = function (selector, context) {
            return new fn.init(selector, context);
        };
        var fn = xxw.prototype = {
            init: function (selector, context) {
                context = context || document.body;
                if (typeof selector === 'object') {
                    this.elements = selector;
                } else {
                    if (context.querySelectorAll) {
                        this.elements = context.querySelectorAll(selector);
                    } else {
                        this.elements = xxw.Selector(selector, context);
                    }
                }
                return this;
            },
            each: function (handle) {
                if (!this.isObj()) {
                    handle.call(this.elements);
                } else {
                    var arr = Array.prototype.slice.call(this.elements);
                    var len = arr.length;
                    for (var i = 0; i < len; i++) {
                        handle.call(this.elements[i]);
                    }
                }
            },
            on: function (etype, handle) {
                this.each(function () {
                    xxw.addEvent(this, etype, handle);
                })
            },
            off: function (etype, handle) {
                this.each(function () {
                    xxw.removeEvent(this, etype, handle);
                })
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
                        this.className += this.className + ' ' + str;
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
            slideUp: function (speed,cb) {
                var my = this;
                my.each(function () {
                    my.animation(this, 'height', 0, this.offsetHeight, my.speed(speed),cb)
                })
            },
            slideDown: function (speed,cb) {
                var my = this;
                my.each(function () {
                    xxw(this).addClass('xxw_show').addClass('xxw_over');
                    my.animation(this, 'height', this.offsetHeight, 0, my.speed(speed),cb)
                })
            },
            animation: function (obj, attr, val, oval, speed,cb) {
                var _attr = oval;
                var t = setInterval(function () {
                    if (_attr === val) {
                        clearInterval(t);
                        if (val === 0 && (attr === 'height' || attr === 'width')) {
                            xxw(obj).addClass('xxw_hide').addClass('xxw_over');
                        }
                        cb();
                    }
                    if (val > oval) {
                        _attr++;
                    } else {
                        _attr--;
                    }
                    obj.style[attr] = _attr + 'px';
                }, speed);
            },
            speed:function(speed){
                switch (speed){
                   case 'fast':
                        return 10;
                    break;
                    case 'slow':
                        return 30;
                    break;
                    case 'normal':
                        return 20;
                    break;
                }
            },
            Alert: function (options) {
                this.each(
                    function () {
                        xxw.Alert(options, this);
                    })
            },
            isObj: function () {
                return (typeof this.elements.length !== 'undefined');
            }
        };
        //Event
        xxw.addEvent = function (obj, etype, handle) {
            if (obj.addEventListener) {
                obj.addEventListener(etype, handle, false);
            } else if (obj.attachEvent) {
                obj.attachEvent('on' + etype, handle);
            } else {
                obj['on' + etype] = handle;
            }
        };
        xxw.removeEvent = function (obj, etype, handle) {
            if (obj.removeEventListener) {
                obj.removeEventListener(etype, handle, false);
            } else if (obj.detachEvent) {
                obj.detachEvent('on' + etype, handle);
            } else {
                obj['on' + etype] = null;
            }
        };
        //Ajax
        xxw.Ajax = function (options, cb) {
            var xmlHttp;
            var defaults = {
                data: '',
                url: '',
                method: 'get',
                async: false

            }
            this.extend(defaults, options);
            if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            } else {
                try {
                    xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
                } catch (e) {
                    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
                }
            }
            if (xmlHttp) {
                var _method = defaults.method.toLowerCase();
                var _uri;
                if (_method === 'get') {
                    _uri = defaults.url + '?' + defaults.data;
                }
                xmlHttp.open(_method, _uri, defaults.async);
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                        cb(xmlHttp.responseText);
                    } else {
                        cb(xmlHttp.status);
                    }
                };
                if (_method === 'get') {
                    xmlHttp.send();
                } else {
                    xmlHttp.send(defaults.data)
                }
            }
        };
        //Alert
        xxw.Alert = function (options, obj) {
            var defaults = {
                title: '',
                body: ''
            };
            xxw.extend(defaults, options);
            var _panel, _a;
            if (!document.getElementById('xxw_Alert')) {
                _panel = document.createElement('div');
                _a = document.createElement('a');
                var _title = document.createElement('div');
                var _body = document.createElement('div');
                _panel.className = 'xxw_Alert xxw_hide';
                _panel.id = 'xxw_Alert';
                _a.className = 'alert_close';
                _a.textContent = '关闭';
                _title.className = 'alert_title';
                _title.textContent = defaults.title;
                _body.className = 'alert_body';
                _body.textContent = defaults.body;
                _title.appendChild(_a);
                _panel.appendChild(_title);
                _panel.appendChild(_body);
                document.body.appendChild(_panel);
            }
            xxw.addEvent(_a, 'click', function () {
                xxw(_panel).addClass('xxw_hide');
                xxw(_panel).delClass('xxw_show');
            });
            if (arguments.length === 1) {
                xxw(_panel).addClass('xxw_show');
            } else {
                xxw.addEvent(obj, 'click', function () {
                    xxw(_panel).addClass('xxw_show');
                    xxw(_panel).delClass('xxw_hide');
                })
            }
        };
        //duilian
        xxw.DuiLian = function (options) {
            var defaults = {
                    lImg: '',
                    rImg: '',
                    lUrl: '',
                    rUrl: ''
                }, _left = document.createElement('div'),
                _right = document.createElement('div'),
                _limg = document.createElement('img'),
                _rimg = document.createElement('img'),
                _la = document.createElement('a'),
                _ra = document.createElement('a');
            this.extend(defaults, options);
            document.body.appendChild(_left);
            document.body.appendChild(_right);
            var l = xxw(_left);
            var r = xxw(_right);
            var la = xxw(_la);
            var ra = xxw(_ra);
            l.addClass('xxw_duilian').addClass('xxw_ie6fixedTL').addChild(_limg).addChild(_la);
            r.addClass('xxw_duilian').addClass('xxw_ie6fixedTR').addChild(_rimg).addChild(_ra);
            var lhide = function () {
                l.addClass('xxw_hide');
                la.off('click', lhide);
            };
            var rhide = function () {
                r.addClass('xxw_hide');
                ra.off('click', rhide);
            };
            xxw(_limg).setAttr('src', defaults.lImg).on('click', function () {
                location.href = defaults.lUrl;
            });
            xxw(_rimg).setAttr('scr', defaults.rImg).on('click', function () {
                location.href = defaults.rUrl;
            });
            la.text('关闭').on('click', lhide);
            ra.text('关闭').on('click', rhide);
        };
        //laMu
        xxw.LaMu = function (options) {
            var defaults = {
                src: '',
                url: '',
                time: 3000,
                delay: 1000
            }
        }

        xxw.Selector = function (selector, context) {
            var _selector = selector.substring(1);
            var arr = [];
            if (selector.charAt(0) === '#') {
                return context.getElementById(_selector)
            } else if (selector.charAt(0) === '.') {
                return xxw.SelectorRecursion(context, selector, arr, '.');
            } else {
                arr = xxw.SelectorRecursion(context, selector, arr, '');
                return arr;
            }
        };
        var selectorArr = [];
        xxw.SelectorRecursion = function (context, selector, arr, str) {
            var _arr = arr;
            for (var i = 0, n = context.childNodes; i < n.length; i++) {
                if (n[i].nodeType === 1) {
                    selectorArr.push(n[i]);
                    if (str === '.') {
                        if (n[i].className === selector) {
                            _arr.push(n[i]);
                        } else {
                            xxw.SelectorRecursion(n[i], selector, _arr, str)
                        }
                    } else {
                        if (n[i].nodeName === selector.toLocaleUpperCase()) {

                            _arr.push(n[i]);
                        } else {
                            xxw.SelectorRecursion(n[i], selector, _arr, str)
                        }
                    }
                }
            }
        }
        //extend
        xxw.extend = fn.extend = function (a, b) {
            for (var attr in b) {
                a[attr] = b[attr];
            }
        };
        //fix Event
        xxw.fixEvent = function (event) {
            var originalEvent = event;
            ev = {
                originalEvent: originalEvent
            };
            var props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which".split(" ");
            for (var i = props.length; i; i--)
                ev[props[i]] = originalEvent[props[i]];
            ev.timeStamp = ev.timeStamp || now();
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
        fn.init.prototype = fn;
        return xxw;
    })();
    window.xxw = xxw;
})();