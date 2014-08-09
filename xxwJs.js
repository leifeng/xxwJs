/**
 * Created by chuanlong on 2014/8/1.
 */
;
(function () {
    window.xxw = (function () {
        var xxw = function (selector, context) {
            return new fn.init(selector, context);
        };
        var fn = xxw.prototype = {
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
                    xxw.addEvent(this, etype, handle);
                });
                return this;
            },
            off: function (etype, handle) {
                this.each(function () {
                    xxw.removeEvent(this, etype, handle);
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
                        this.className = this.className + ' ' + str;
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
            slideUp: function (time, val, cb) {
                var my = this;
                my.each(function () {
                    var val2 = val || this.offsetHeight;
                    xxw(this).addClass('xxw_over');
                    my.animation(this, 'height', 0, val2, time, cb)
                })
            },
            slideDown: function (time, val, cb) {
                var my = this;
                my.each(function () {
                    var val2 = val || this.offsetHeight;
                    xxw(this).addClass('xxw_show').addClass('xxw_over').delClass('xxw_hide');
                    my.animation(this, 'height', val2, 0, time, cb)
                })
            },
            delayTime: function (next, t) {
                setTimeout(function () {
                    next();
                }, t)
            },
            animation: function (obj, attr, end, start, time, cb) {
                var t = -1;
                var now = start;
                var direction = (start > end);
                var temp = time;
                var seed = Math.floor(Math.abs((Math.abs(start) - Math.abs(end)) / temp));
                if (direction) {
                    seed = 0 - seed;
                }
                t = setInterval(function () {
                    if (direction) {
                        if (now <= end) {
                            clearInterval(t);
                            if (end === 0 && (attr === 'height' || attr === 'width')) {
                                xxw(obj).addClass('xxw_hide').delClass('xxw_show');
                                document.body.removeChild(obj)
                            }
                            if (typeof cb === 'function') {
                                cb();
                            }
                            return
                        }
                    } else {
                        if (now >= end) {
                            clearInterval(t);
                            if (typeof cb === 'function') {
                                cb();
                            }
                            return
                        }
                    }
                    now += seed;
                    if (now < 0) {
                        now = 0;
                    }
                    obj.style.cssText = attr + ':' + now + 'px';

                }, time);
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
        xxw.ajax = function (options, cb) {
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
        xxw.alert = function (options) {
            xxw.other.mouseScrollStop();
            var defaults = {
                width: 300,
                height: 300,
                title: '',
                body: '',
                mask: false,//是否有遮照
                confirm: false,  //是否需要确认
                cb: null
            };
            this.extend(defaults, options);
            var left = (xxw.other.bodyW / 2 - defaults.width / 2),
                title, body, a, confirm, yes, no, mainObj, main, my;
            my = this;
            if (defaults.mask) {
                my.mask(true);
            }
            mainObj = xxw('#xxw_Alert');
            if (!mainObj.elements.length) {
                main = document.createElement('div');
                title = document.createElement('div');
                body = document.createElement('div');
                a = document.createElement('a');
                mainObj = xxw(main);
                mainObj.setAttr('id', 'xxw_Alert').addClass('xxw_Alert').css('width:' + defaults.width + 'px;height:' + defaults.height + 'px+;left:' + left + 'px');
                a.className = 'alert_close';
                a.innerText = a.textContent = '关闭';
                title.className = 'alert_title';
                body.className = 'alert_body';
                title.innerText = title.textContent = defaults.title;
                title.appendChild(a);
                body.innerHTML = defaults.body;
                mainObj.addChild(title).addChild(body);
                if (defaults.confirm) {
                    if (typeof defaults.cb !== 'function') {
                        alert('错误：交互功能需要回调cb');
                        return;
                    }
                    confirm = document.createElement('div');
                    yes = document.createElement('a');
                    no = document.createElement('a');
                    confirm.className = 'alert_confirm';
                    yes.className = 'yes';
                    no.className = 'no';
                    yes.innerText = yes.textContent = '确定';
                    no.textContent = no.innerText = '取消';
                    confirm.appendChild(yes);
                    confirm.appendChild(no);
                    mainObj.addChild(confirm);
                    xxw.addEvent(yes, 'click', function () {
                        mainObj.addClass('xxw_hide').delClass('xxw_show');
                        if (defaults.mask) {
                            my.mask(false);
                        }
                        xxw.other.mouseScrollStart();
                        defaults.cb('yes');
                    });
                    xxw.addEvent(no, 'click', function () {
                        mainObj.addClass('xxw_hide').delClass('xxw_show');
                        xxw.other.mouseScrollStart();
                        if (defaults.mask) {
                            my.mask(false);
                        }
                        defaults.cb('no');
                    });
                }
                document.body.appendChild(mainObj.elements);
                xxw.addEvent(a, 'click', function () {
                    mainObj.delClass('xxw_show').addClass('xxw_hide');
                    if (defaults.mask) {
                        my.mask(false);
                    }
                    xxw.other.mouseScrollStart();
                });
            } else {
                if (defaults.mask) {
                    this.mask(true);
                }
                mainObj.delClass('xxw_hide').addClass('xxw_show');
            }

        };
        //对联
        xxw.duiLian = function (options) {
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
            xxw(_rimg).setAttr('src', defaults.rImg).on('click', function () {
                location.href = defaults.rUrl;
            });
            la.text('关闭').on('click', lhide);
            ra.text('关闭').on('click', rhide);
        };
        //拉幕
        fn.laMu = function (options) {
            var defaults = {
                src: '',
                url: '',
                delay: 8000,
                cb: null
            };
            this.extend(defaults, options);
            var my = this;
            var img = document.createElement('img');
            img.setAttribute('src', defaults.src);
            xxw.addEvent(img, 'click', function () {
                location.href = defaults.url;
            });
            img.onload = function () {
                my.addChild(img);
                my.delayTime(function () {
                    my.slideUp(45, img.height, function () {
                        if (typeof defaults.cb === 'function') {
                            defaults.cb();
                        }
                    })
                }, defaults.delay)
            };

        };
        //遮照
        xxw.mask = function (str) {
            var _m = xxw('#xxw_mask');
            if (!_m.elements.length) {
                var div = document.createElement('div');
                _m = xxw(div);
                _m.setAttr('id', 'xxw_mask').css('height:' + xxw.other.bodyH + 'px');
                document.body.appendChild(_m.elements)
            }
            if (str) {
                _m.className('xxw_show')
            } else {
                _m.className('xxw_hide')
            }
        };
        //图片轮播、
        fn.lunBuo = function (options) {
            var defaults = {
                img: [],
                style: 1,//风格1，2，3
                autoRun: true //自动播放
            }
            this.extend(defaults, options);
            return new fn.lunBuo.prototype.init(this, defaults);

        }
        fn.lunBuo.prototype = {
            init: function (obj, options) {
                this.options = options;
                this.index = 1;
                this.aArr = [];
                this.imgArr=[];
                this.num = options.img.length;
                obj.addClass('xxw_relative').addClass('xxw_border_1').addClass('xxw_over');
                this.makeDom(obj);
            },
            makeDom: function (obj) {
                var _this = this;
                var title = document.createElement('div');
                this.title = title;
                title.className = 'xxw_lunBuo_title' + this.options.style;
                for (var i = 0; i < this.num; i++) {
                    var a = document.createElement('a');
                    var img=document.createElement('img');
                    img.className = 'xxw_lunBo_img' + this.options.style;
                    img.src=this.options.img[i].src;
                    a.className = 'xxw_lunBuo_nav' + this.options.style + ' xxw_lunBuo_a_link' + this.options.style;
                    a.textContent = a.innerText = i + 1;
                    a.style.cssText = 'left:' + i * 22 + 'px';
                    this.aArr.push(a);
                    this.imgArr.push(img);
                    obj.addChild(a).addChild(img);
                    (function (i) {
                        xxw.addEvent(a, 'click', function () {
                            _this.index = i + 1;
                            _this.show(i + 1);
                        })
                        xxw.addEvent(img, 'click', function () {
                            location.href=_this.options.img[i].url;
                        });
                    })(i)
                }
                obj.addChild(img).addChild(title);
                this.show(this.index);
                if (this.options.autoRun) {
                    this.autoRun();
                }
            },
            show: function (index) {
                index--;
                this.delCss();
                this.title.textContent = this.title.innerText = this.options.img[index].txt;
                this.aArr[index].className = 'xxw_lunBuo_nav' + this.options.style + ' xxw_lunBuo_a_hover' + this.options.style;
                this.imgArr[index].style.cssText='z-index:1';
            },
            delCss: function () {
                for (var i = 0; i < this.aArr.length; i++) {
                    this.aArr[i].className = 'xxw_lunBuo_nav' + this.options.style + ' xxw_lunBuo_a_link' + this.options.style;
                    this.imgArr[i].style.cssText='z-index:-1';
                }
            },
            autoRun: function () {
                var _this = this;
                setInterval(function () {
                    _this.index++;
                    if (_this.index > _this.num) {
                        _this.index = 1;
                    }
                    _this.show(_this.index);
                }, 2500)
            }

        };
        fn.lunBuo.prototype.init.prototype = fn.lunBuo.prototype;
        //移动判断
        xxw.isMolib = function () {
            return navigator.appVersion.toString().toLowerCase().indexOf('windows') === -1 ? true : false;
        };
        //querystring
        xxw.getQuery = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        };
        //extend
        xxw.extend = fn.extend = function (a, b) {
            for (var key in b) {
                a[key] = b[key];
            }
        };
        xxw.other = {
            bodyW: document.body.clientWidth,
            bodyH: document.body.clientHeight,
            mouseScrollStop: function () {
                xxw(document).on('DOMMouseScroll', stopDefault).on('mousewheel', stopDefault)
            },
            mouseScrollStart: function () {
                xxw(document).off('DOMMouseScroll', stopDefault).off('mousewheel', stopDefault);
            }
        };
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
        //阻止默认事件
        function stopDefault(e) {
            e = xxw.fixEvent(e.event || window.event);
            e.preventDefault();
            e.stopPropagation();
        }

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
        //兼容
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
        fn.init.prototype = fn;
        return xxw;
    })();
})
();