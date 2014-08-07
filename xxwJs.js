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
            css:function(css){
                this.each(function () {
                    this.style.cssText=css;
                })
            },
            slideUp: function (speed, cb) {
                var my = this;
                my.each(function () {
                    my.animation(this, 'height', 0, this.offsetHeight, my.speed(speed), cb)
                })
            },
            slideDown: function (speed, cb) {
                var my = this;
                my.each(function () {
                    xxw(this).addClass('xxw_show').addClass('xxw_over');
                    my.animation(this, 'height', this.offsetHeight, 0, my.speed(speed), cb)
                })
            },
            animation: function (obj, attr, val, oval, speed, cb) {
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
            speed: function (speed) {
                switch (speed) {
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
                    data: null,
                    url: '',
                    method: 'get',
                    async: false

                }
                , _data = ''
                , _method
                , _uri;
            this.extend(defaults, options);
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
        //Alert
        xxw.Alert = function (options) {
            var defaults = {
                width: 300,
                height: 300,
                title: '',
                body: '',
                confirm: false,  //是否需要确认
                cb: null
            };
            this.extend(defaults, options);
            var main = document.getElementById('xxw_Alert'),
                left = (xxw.other.bodyW / 2 - defaults.width / 2),
                title, body, a,confirm,yes,no,mainObj;
            if (!main) {
                main = document.createElement('div');
                title = document.createElement('div');
                body = document.createElement('div');
                a = document.createElement('a');
                mainObj=xxw(main);
                main.id = 'xxw_Alert';
                main.className = 'xxw_Alert';
                title.className = 'alert_title';
                a.className = 'alert_close';
                body.className = 'alert_body';
                a.textContent = '关闭';
                title.textContent = defaults.title;
                title.appendChild(a);
                body.innerHTML = defaults.body;
                mainObj.css( 'width:' + defaults.width + 'px;height:' + defaults.height + 'px+;left:' + left + 'px');
                mainObj.addChild(title).addChild(body);
                if (defaults.confirm) {
                    if(typeof defaults.cb!=='function'){
                        alert('错误：交互功能需要回调cb');
                        return;
                    }
                    confirm=document.createElement('div');
                    yes=document.createElement('a');
                    no=document.createElement('a');
                    confirm.className='alert_confirm';
                    yes.className='yes';
                    no.className='no';
                    yes.textContent='确定';
                    no.textContent='取消';
                    confirm.appendChild(yes);
                    confirm.appendChild(no);
                    mainObj.addChild(confirm);
                    xxw.addEvent(yes, 'click', function () {
                        mainObj.addClass('xxw_hide').delClass('xxw_show');
                        defaults.cb('yes');
                    });
                    xxw.addEvent(no, 'click', function () {
                        mainObj.addClass('xxw_hide').delClass('xxw_show');
                        defaults.cb('no');
                    });
                }
                document.body.appendChild(main);
                xxw.addEvent(a, 'click', function () {
                    mainObj.addClass('xxw_hide').delClass('xxw_show');
                });
            } else {
                mainObj=xxw(main);
                mainObj.addClass('xxw_show').delClass('xxw_hide');
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
        };
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
        xxw.other = {
            bodyW: document.body.clientWidth,
            bodyH: document.body.clientHeight
        }
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
        fn.init.prototype = fn;
        return xxw;
    })();
    window.xxw = xxw;
})
();