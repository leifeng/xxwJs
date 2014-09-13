/**
 * Created by chuanlong on 2014/8/1.
 */
;
(function () {

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
            var seed = Math.floor(Math.abs((Math.abs(start) - Math.abs(end)) / time));
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
    //json
    xxw.json = function (options, cb) {
        var defaults = {
            url: '',
            data: ''
        };
        this.extend(defaults, options);
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
            }, 100)

        };
        script.src = defaults.url + '?callback=' + cbName + '&' + _data;
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
    //图片轮播
    fn.lunBuo = function (options) {
        var defaults = {
            img: [],
            style: 1,//风格1，2，3
            autoRun: true, //自动播放
            time: 3000,//切换时间
            showTitle: true,
            showA: true
        };
        this.extend(defaults, options);
        return new fn.lunBuo.prototype.init(this, defaults);

    };
    fn.lunBuo.prototype = {
        init: function (obj, options) {
            this.options = options;
            this.index = 1;
            this.aArr = [];
            this.imgArr = [];
            this.num = options.img.length;
            if (!this.num) {
                return;
            }
            obj.addClass('xxw_relative').addClass('xxw_over');
            this.makeDom(obj);
        },
        makeDom: function (obj) {
            var _this = this;
            var title = document.createElement('div');
            obj.addChild(title);
            this.title = title;
            if (!this.options.showTitle) {
                title.className = 'xxw_hide'
            } else {
                title.className = 'xxw_lunBuo_title' + this.options.style;
            }
            for (var i = 0; i < this.num; i++) {
                var a = document.createElement('a');
                var link=document.createElement('a');
                var img = document.createElement('img');
                link.appendChild(img);
                obj.addChild(a).addChild(link);
                link.href = _this.options.img[i].url;
                link.target = '_blank';
                img.className = 'xxw_lunBo_img';
                img.src = this.options.img[i].src;
                a.className = 'xxw_lunBuo_nav' + this.options.style + ' xxw_lunBuo_a_link' + this.options.style;
                a.textContent = a.innerText = i + 1;
                a.style.cssText = 'left:' + i * 22 + 'px';
                this.aArr.push(a);
                this.imgArr.push(img);
                (function (i) {
                    xxw.addEvent(a, 'mouseover', function () {
                        _this.index = i + 1;
                        _this.show(i + 1);
                    });
                })(i)
            }

            this.show(this.index);
            if (this.options.autoRun) {
                this.autoRun();
            }
        },
        show: function (index) {
            index--;
            this.delCss();
            this.title.textContent = this.title.innerText = this.options.img[index].txt;
            if (!this.options.showA) {
                this.aArr[index].className = 'xxw_hide'
            } else {
                this.aArr[index].className = 'xxw_lunBuo_nav' + this.options.style + ' xxw_lunBuo_a_hover' + this.options.style;
            }
            this.imgArr[index].style.cssText = 'z-index:1';
        },
        delCss: function () {
            for (var i = 0; i < this.aArr.length; i++) {
                if (!this.options.showA) {
                    this.aArr[i].className = 'xxw_hide'
                } else {
                    this.aArr[i].className = 'xxw_lunBuo_nav' + this.options.style + ' xxw_lunBuo_a_link' + this.options.style;
                }
                this.imgArr[i].style.cssText = 'z-index:-1';
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
            }, _this.options.time)
        }

    };
    fn.lunBuo.prototype.init.prototype = fn.lunBuo.prototype;
    //图片切换1
    fn.slider = function (W, w) {
        return new fn.slider.prototype.init(this.elements[0], W, w);
    };
    fn.slider.prototype = {
        init: function (obj, W, w) {
            this.w = w;
            this.obj = obj;
            this.sliderC = obj.children;
            this.sliderC_Num = this.sliderC.length;
            this.avg = Math.ceil(W / this.sliderC_Num);
            this.make();
        },
        make: function () {
            var c = this.sliderC;
            var c_num = this.sliderC_Num;
            var avg = this.avg;
            var w = this.w;
            var obj = this.obj;
            var child = [];
            for (var i = 0; i < c_num; i++) {
                c[i].style.left = (avg * i) + 'px';
                c[i].style.zIndex = 20 * i;
                child.push(c[i].children[0]);
            }
            this.adEvent(child)
        },
        adEvent: function (child) {
            var _this = this;
            var w = _this.w;
            var obj = _this.obj;
            var avg = _this.avg;
            var childL = child.length;
            var c_num = _this.sliderC_Num;
            var c = _this.sliderC;
            var leave = function (e) {
                e = xxw.fixEvent(e.event || window.event);
                var target = e.target;
                if (target.nodeName === 'DIV') {
                    for (var i = 0; i < c_num; i++) {
                        _this.animation(c[i], c[i].style.left.replace('px', '') - 0, avg * i);
                    }
                    xxw.removeEvent(obj, 'mouseleave', leave);
                }
                e.stopPropagation();

            };
            var enter = function (e) {
                e = xxw.fixEvent(e.event || window.event);
                e.stopPropagation();
                var target = e.target;
                if (target.nodeName === 'IMG') {
                    var index = child.indexOf(target);
                    for (var i = 0; i < childL; i++) {
                        var p = child[i].parentNode;
                        var pLeft = p.style.left.replace('px', '') - 0;
                        if (i != index) {
                            if (i < index) {
                                if (i != 0) {
                                    _this.animation(p, pLeft, i * 30);
                                }

                            } else {
                                _this.animation(p, pLeft, w - (childL - i) * 30);
                            }
                        } else {
                            if (i != 0) {

                                _this.animation(p, pLeft, i * 30);
                            }
                        }
                    }
                }
                xxw.addEvent(obj, 'mouseleave', leave);
            };
            xxw.addEvent(obj, 'mouseover', enter);
        },
        animation: function (obj, a, b) {
            var temp = Math.ceil(Math.abs(a - b) / 10);
            if (a < b) {
                var t1 = setInterval(function () {
                    if (a >= b) {
                        clearInterval(t1);
                    } else {
                        a += temp;

                        obj.style.left = a + 'px';
                    }

                }, 30)
            } else {
                var t2 = setInterval(function () {
                    if (a <= b) {
                        clearInterval(t2);
                    } else {
                        a -= temp;
                        obj.style.left = a + 'px';
                    }
                }, 30)
            }
        }
    };
    fn.slider.prototype.init.prototype = fn.slider.prototype;
    //图片滚动
    fn.gundong = function (options) {
        var defaults = {
            dir: 'left',//left  up right down
            time: 200,
            list: [
                {url: '', src: '', txt: ''}
            ],
            w: 100,
            h: 100,
            autoRun: true,
            type: 'line',
            left: null,
            right: null
        };
        this.extend(defaults, options);
        return new fn.gundong.prototype.init(this, defaults);
    };
    fn.gundong.prototype = {
        init: function (obj, options) {
            this.options = options;
            this.obj = obj;
            obj.addClass('xxw_over').addClass('xxw_relative');
            this.make();
        },
        make: function () {
            var n = this.options.list.length;
            var div = document.createElement('div');
            var ul = document.createElement('ul');
            div.appendChild(ul);
            this.obj.addChild(div);
            this.div = div;
            ul.className = 'xxw_gundong_ul';
            div.className = 'xxw_gundong_div';
            for (var i = 0; i < n; i++) {
                var li = document.createElement('li');
                var img = document.createElement('img');
                var title = document.createElement('div');
                var a = document.createElement('a');
                a.appendChild(img);
                a.appendChild(title);
                li.appendChild(a);
                ul.appendChild(li);
                li.className = 'xxw_gundong_li';
                a.className = 'xxw_gundong_a';
                img.className = 'xxw_gundong_img';
                title.className = 'xxw_gundong_title';
                li.style.cssText = 'width:' + this.options.w + 'px;height:' + this.options.h + 'px';
                img.src = this.options.list[i].src;
                a.setAttribute('href', this.options.list[i].url);
                title.textContent = title.innerText = this.options.list[i].txt;
            }
            this.setting(div, ul);

        },
        run: function (temp, n, speed, time) {
            var _this = this,
                t = -1,
                t2 = -1,
                stop = false,
                left = this.options.left,
                right = this.options.right,
                dir,
                temp = temp,
                time2;
            var gd = function () {
                dir = arguments[0] || _this.options.dir;
                if (dir === 'left' || dir === 'top') {
                    if (temp === -n) {
                        temp = 0;
                    } else {
                        temp = temp - speed;
                    }
                } else {
                    if (temp === 0) {
                        temp = -n;
                    } else {
                        temp = temp + speed;
                    }
                }
                _this.setCss(temp);
                if (!stop && _this.options.autoRun) {
                    if (t != -1) {
                        clearTimeout(t);
                    }
                    t = setTimeout(gd, time);
                }
            };
            gd();
            xxw.addEvent(_this.div, 'mouseover', function () {
                stop = true;
            });
            xxw.addEvent(_this.div, 'mouseleave', function () {
                stop = false;
                gd();
            });
            if (this.options.left && this.options.right) {
                if (this.options.type === 'line') {
                    time2=100
                } else {
                    time2 = 2000;
                }
                xxw(left).on('mousedown', function () {
                    stop = true;
                    t2 = setInterval(function () {
                        gd('left');
                    }, time2);
                });
                xxw(left).on('mouseup', function () {
                    stop = false;
                    clearInterval(t2);
                    if(_this.options.autoRun){
                        gd();
                    }

                });
                xxw(right).on('mousedown', function () {
                    stop = true;
                    t2 = setInterval(function () {
                        gd('right');
                    }, time2);
                });
                xxw(right).on('mouseup', function () {
                    stop = false;
                    clearInterval(t2);
                    if(_this.options.autoRun){
                        gd();
                    }
                });
            }
        },
        setCss: function (css) {
            if (this.options.dir === 'left' || this.options.dir === 'right') {
                this.obj.elements[0].scrollLeft = (0 - css);
            } else {
                this.obj.elements[0].scrollTop = (0 - css);
            }
        },
        setting: function (div, ul) {
            var _this = this,
                n = this.options.list.length,
                ul2 = ul.cloneNode(true),
                total,
                temp = 0,
                time = this.options.time,
                speed;
            div.appendChild(ul2);
            if (this.options.dir === 'left') {
                div.style.cssText = 'width:' + (n * (this.options.w + 20) * 2) + 'px';
                total = this.options.list.length * (this.options.w + 20);
                speed = this.options.w + 20;
            } else if (this.options.dir === 'right') {
                div.style.cssText = 'width:' + (n * (this.options.w + 20) * 2) + 'px';
                total = this.options.list.length * (this.options.w + 20);
                speed = this.options.w + 20;
                temp = -total;
            } else if (this.options.dir === 'top') {
                div.style.cssText = 'height:' + (n * (this.options.h + 20) * 2) + 'px';
                total = this.options.list.length * (this.options.h + 20);
                speed = this.options.h + 20;
            } else {
                div.style.cssText = 'height:' + (n * (this.options.h + 20) * 2) + 'px';
                total = this.options.list.length * (this.options.h + 20);
                speed = this.options.h + 20;
                temp = -total;
            }
            if (this.options.type === 'line') {
                speed =total / time;
            } else {
                time = 2000;
            }
            this.run(temp, total, speed, time);
        }

    };
    fn.gundong.prototype.init.prototype = fn.gundong.prototype;
    //圆形导航
    fn.circleNav = function (options) {
        var defaults = {
            list: [
                {url: '#', txt: '1'}
            ],
            r: 10 //半径
        };
        this.extend(defaults, options);
        return new fn.circleNav.prototype.init(this, defaults);
    };
    fn.circleNav.prototype = {
        init: function (obj, options) {
            var _this = this;
            this.state = false;
            this.arr = [];
            this.style = {};
            obj.addClass('xxw_circleNav');
            obj.css('width:' + options.w + 'px;height:' + options.h + 'px;line-height:' + options.h + 'px');
            this.num = options.list.length;
            this.jd = 360 / (this.num);
            var span = document.createElement('span');
            span.className = 'xxw_circleMain';
            span.textContent = span.innerText = '点击';
            obj.addChild(span);
            obj.on('click', function (e) {
                e = xxw.fixEvent(e.event || window.event);
                if (e.target.nodeName === 'SPAN') {
                    if (!_this.state) {
                        _this.show();
                    } else {
                        _this.hide();
                    }
                }
            });
            for (var i = 0; i < this.num; i++) {
                var a = document.createElement('a');
                a.href = options.list[i].url;
                a.textContent = a.innerText = options.list[i].txt;
                var _jd = this.jd * i;
                var _hd = (2 * Math.PI / 360) * _jd;
                var x = Math.sin(_hd) * options.r;
                var y = -Math.cos(_hd) * options.r;
                this.arr.push(a);
                this.style[i] = "translate(" + x + "px," + y + "px)";
                obj.addChild(a);
            }
        },
        show: function () {
            this.state = true;
            for (var i = 0; i < this.arr.length; i++) {
                this.transform(this.arr[i], i, this.style[i], 20, 20)
            }
        },
        hide: function () {
            this.state = false;
            for (var i = 0; i < this.arr.length; i++) {
                this.transform(this.arr[i], (this.arr.length - i), 'translate(0px,0px)', 0, 0);
            }
        },
        transform: function (obj, i, str, w, h) {
            obj.style.width = w + 'px';
            obj.style.height = h + 'px';
            obj.style.transform = obj.style.webkitTransform = obj.style.mozTransform = obj.style.oTransform = obj.style.msTransform = str;
            //    obj.style.transitionDelay = obj.style.webkitTransitionDelay = obj.style.mozTransitionDelay = obj.style.msTransitionDelay =obj.style.oTransitionDelay = (i*80) + "ms";
        }
    };
    fn.circleNav.prototype.init.prototype = fn.circleNav.prototype;
    //发布/订阅
    xxw.ps = function () {
        this.id = 0;
        this._event = {};
    };
    xxw.ps.prototype.sub = function (n, f) {
        if (!this._event[n]) {
            this._event[n] = [];
            this._event[n].push({
                id: (++this.id),
                fn: f
            });

        } else {
            var has = this._event[n].some(function (elem, index, arr) {
                return elem.fn === fn;
            });
            if (!has) {
                this._event[n].push({
                    id: (++this.id),
                    fn: f
                });
            }
        }
        return this.id;
    };
    xxw.ps.prototype.pub = function (n, arr) {
        if (!this._event[n]) return;
        for (var i = 0; i < this._event[n].length; i++) {
            this._event[n][i].fn(arr)
        }
    };
    xxw.ps.prototype.unsub = function (n) {
        if (typeof n == 'number') {
            for (var key in this._event) {
                for (var i = 0; i < this._event[key].length; i++) {
                    if (this._event[key].id === n) {
                        delete this._event[key];
                    }
                }
            }
        } else {
            delete this._event[n]
        }

    };
    //移动判断
    xxw.isMolib = function () {
        return navigator.appVersion.toString().toLowerCase().indexOf('windows') === -1 ? true : false;
    };
    //querystring
    xxw.getQuery = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return encodeURI(r[2]);
        return null;
    };
    xxw.href = function (url) {
        var a = document.getElementById('xxw_href');
        if (!a) {
            a = document.createElement('a');
            a.id = 'xxw_href';
            a.className = 'xxw_hide';
            a.target = '_blank';
            document.body.appendChild(a)
        }
        a.setAttribute('href', url);
        var ev = document.createEvent('MouseEvents');
        ev.initEvent('click', false, true);
        a.dispatchEvent(ev);
    };
    xxw.cookie = {
        get: function (key) {
            var _cookie = document.cookie;
            if (_cookie.length > 0) {
                var start = _cookie.indexOf(key + '=');
                if (start != -1) {
                    var begin = key.length + 1;
                    var end = _cookie.indexOf(";", begin);
                    if (end === -1) end = _cookie.length;
                    return encodeURI(_cookie.substring(begin, end));
                }
                return null;
            }
        },
        set: function (key, val, time) {
            var ExpireDate = new Date();
            ExpireDate.setTime(ExpireDate.getTime() + (time * 24 * 3600 * 1000));
            document.cookie = key + '=' + decodeURI(val) + ';expires=' + (time == null ? '' : ExpireDate.toUTCString()) + ';';
        },
        del: function (key) {
            if (this.get(key)) {
                document.cookie = key + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
            }
        }
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
    xxw.animation = fn.animation;
    fn.init.prototype = fn;
    window.xxw = xxw;

})();