/**
 * Created by chuanlong on 2014/12/9.
 *
 */
define(['xxwOther', 'xxwAnimation'], function (other, animate) {
    'use strict';
    var fp = function (options) {
        return new fp.prototype.init(options);
    };
    fp.prototype = {
        init: function (options) {
            var defaults = {
                //主要
                panel: null,
                //样式
                background: ['lightgreen', 'chocolate', 'royalblue'],
                //导航
                navShow: true,
                navColor:'lightgray',
                //动画
                autoScroll: false,
                rep: false,
                //事件
                afterScroll: null
            };
            this.opts = other.extend(defaults, options);
            this.main = other.$$(this.opts.panel);
            this.container = other.getClass(this.main, 'xxw_fp_container')[0];
            this.nav = other.getFirstChild(this.main);
            this.pages = other.getClass(this.container, 'xxw_fp_page');
            this.index = 0;
            this.navChild = [];
            this.makeHtml();
            this.makeSize();
            this.bindEvent();
        },
        makeHtml: function () {
            this.opts.afterScroll(this.index, this.pages[this.index]);
            if (!this.opts.navShow) {
                this.nav.style.cssText = 'display:none';
            } else {
                for (var i = 0; i < this.pages.length; i++) {
                    this.pages[i].style.backgroundColor = this.opts.background[i];
                    var a = document.createElement('a');
                    this.nav.appendChild(a);
                    a.innerHTML = '&nbsp;';
                    a.style.cssText='background-color:'+this.opts.navColor;
                    this.navChild.push(a);
                }
            }
        },
        makeSize: function () {
            var bodyH = other.clientHeight();
            this.container.style.cssText = 'height:' + bodyH + 'px';
            animate(this.container, {scrollTop: bodyH * this.index});
            for (var i = 0; i < this.pages.length; i++) {
                this.pages[i].style.height = bodyH + 'px';
            }
        },
        bindEvent: function () {
            var that = this;
            other.addEvent(window, 'resize', function () {
                setTimeout(function () {
                    that.makeSize.call(that, arguments);
                }, 400);
            });
            other.addEvent(window, 'keydown', function (e) {
                e = other.fixEvent(e);
                var key = e.keyCode;
                if (key === 40) {
                    that.nextPage();
                }
                if (key == 38) {
                    that.prevPage();
                }
            });
        },
        changeNav: function () {
            if (this.opts.navShow) {
                for (var i = 0; i < this.navChild.length; i++) {
                    this.navChild[i].style.cssText = 'background-color:' + this.opts.navColor;
                }
                this.navChild[this.index].style.backgroundColor = 'red';
            }
        },
        nextPage: function () {
            var that = this;
            if (this.index == this.pages.length - 1) return;
            this.index++;
            if (this.index > this.pages.length - 1) this.index = this.pages.length - 1;
            var bodyH = other.clientHeight();
            animate(this.container, {scrollTop: bodyH * this.index}, that.opts.afterScroll(that.index, that.pages[that.index]));
            this.changeNav()
        },
        prevPage: function () {
            var that = this;
            if (this.index == 0) return;
            this.index--;
            if (this.index < 0) this.index = 0;
            var bodyH = other.clientHeight();
            animate(this.container, {scrollTop: bodyH * this.index}, that.opts.afterScroll(that.index, that.pages[that.index]));
            this.changeNav()
        }
    };
    fp.prototype.init.prototype = fp.prototype;
    return fp;
});