/**
 * Created by zcl on 14-9-16.
 *
 *
 *     lunBuo({
        panel: '#lm',
        img: [
            {src: 'http://img1.0372.cn:83/201408/20140806104345.jpg', txt: '123123', url: '#'},
            {src: 'http://img1.0372.cn:83/201408/20140806055740.jpg', txt: '3333333333333333', url: '#'},
            {src: 'http://img1.0372.cn:83/201408/20140809114152.jpg', txt: 'asdfasdf', url: '#'},
            {src: 'http://img1.0372.cn:83/201408/20140809112623.jpg', txt: 'asdf', url: '#'},
            {src: 'http://img1.0372.cn:83/201408/20140806055740.jpg', txt: 'asdfasdf', url: '#'}
        ],
        style: 1,
        time: 4000
    });
 */

define(['xxwOther'], function (other) {
    'use strict';
    var lunBuo = function (options) {
        return new lunBuo.prototype.init(options);
    };
    lunBuo.prototype = {
        init: function (options) {
            var defaults = {
                panel: null,
                img: [],
                style: 1,//风格1，2，3
                autoRun: true, //自动播放
                time: 3000,//切换时间
                showTitle: true,
                showA: true
            };
            this.options = other.extend(defaults, options);
            this.index = 1;
            this.aArr = [];
            this.imgArr = [];
            this.num = options.img.length;
            this.obj = other.$$(this.options.panel);
            this.obj.className='xxw_relative xxw_over '+ this.obj.className;
            this.makeDom(this.obj);
        },
        makeDom: function (obj) {
            if (!this.num) {
                return;
            }
            var that = this,
                title = document.createElement('div');
            obj.appendChild(title);
            this.title = title;
            if (!this.options.showTitle) {
                title.className = 'xxw_hide';
            } else {
                title.className = 'xxw_lunBuo_title' + this.options.style;
            }
            for (var i = 0; i < this.num; i++) {
                var a = document.createElement('a'),
                    link = document.createElement('a'),
                    img = document.createElement('img');
                link.appendChild(img);
                obj.appendChild(a);
                obj.appendChild(link);
                link.href = that.options.img[i].url;
                link.target = '_blank';
                img.className = 'xxw_lunBo_img';
                img.src = that.options.img[i].src;
                a.className = 'xxw_lunBuo_nav' + that.options.style + ' xxw_lunBuo_a_link' + that.options.style;
                a.textContent = a.innerText = i + 1;
                a.style.cssText = 'left:' + i * 22 + 'px';
                that.aArr.push(a);
                that.imgArr.push(img);
                (function (i) {
                    other.addEvent(a, 'mouseover', function () {
                        that.index = i + 1;
                        that.show(i + 1);
                    });
                })(i);
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
                this.aArr[index].className = 'xxw_hide';
            } else {
                this.aArr[index].className = 'xxw_lunBuo_nav' + this.options.style + ' xxw_lunBuo_a_hover' + this.options.style;
            }
            this.imgArr[index].style.cssText = 'z-index:1';
        },
        delCss: function () {
            for (var i = 0; i < this.aArr.length; i++) {
                if (!this.options.showA) {
                    this.aArr[i].className = 'xxw_hide';
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
            }, _this.options.time);
        }
    };
    lunBuo.prototype.init.prototype = lunBuo.prototype;
    return lunBuo;
});