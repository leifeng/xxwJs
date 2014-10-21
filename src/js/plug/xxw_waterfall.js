/**
 * Created by chuanlong on 2014/10/20.
 *
 * waterfall({
 * scroll:true,
 * resize:true,
 * list:[{src:'',title:''},{src:'',title:''}]
 * });
 */

define(['xxwOther'], function (other) {
    'use strict';
    var waterfall = function (option, cb) {
        return new waterfall.prototype.init(option, cb);
    };
    waterfall.prototype = {
        init: function (option, cb) {
            if (option.resize) {
                this.resize();
            }
            if (option.scroll) {
                this.scroll(cb);
            }
            this.makeHtml(option);
        },
        makeHtml: function (option) {
            var parent = document.getElementById('xxw_waterfall');
            if (!parent) {
                parent = document.createElement('div');
                parent.id = 'xxw_waterfall';
                document.body.appendChild(parent);
            }
            for (var i = 0; i < option.list.length; i++) {
                var src = option.list[i].src;
                var title = option.list[i].title;
                var box = document.createElement('div');
                var pic = document.createElement('div');
                var image = document.createElement('img');
                pic.appendChild(image);
                box.appendChild(pic);
                parent.appendChild(box);
                box.className = 'xxw_waterfall_box';
                pic.className = 'xxw_waterfall_pic';
                image.src = src;
            }
            this.setStyle();
        },
        setStyle: function () {
            var parent = document.getElementById('xxw_waterfall');
            this.oBoxs = other.getClass(parent, 'xxw_waterfall_box');
            var wBox = this.oBoxs[0].offsetWidth;
            this.nBox = Math.floor(other.clientWidth() / wBox);
            parent.style.cssText = 'width:' + this.nBox * wBox + 'px;';
            this.getColsH();
        },
        getColsH: function () {
            var hArrs = [];
            for (var i = 0; i < this.oBoxs.length; i++) {
                if (i < this.nBox) {
                    this.oBoxs[i].style.cssText = '';
                    hArrs.push(this.oBoxs[i].offsetHeight);
                } else {
                    var hMinVal = Math.min.apply(null, hArrs);
                    var minIndex = this.getMinIndex(hArrs, hMinVal);
                    this.oBoxs[i].style.position = 'absolute';
                    this.oBoxs[i].style.left = this.oBoxs[minIndex].offsetLeft + 'px';
                    this.oBoxs[i].style.top = hMinVal + 'px';
                    hArrs[minIndex] += this.oBoxs[i].offsetHeight;
                }
            }
        },
        getMinIndex: function (arr, val) {
            for (var i in arr) {
                if (arr[i] === val) {
                    return i;
                }
            }
        },
        resize: function () {
            var that = this;
            var timer;
            window.onresize = function () {
                clearTimeout(timer);
                timer = window.setTimeout(that.setStyle(), 10);
            };
        },
        scroll: function (cb) {
            var that = this;
            window.onscroll = function () {
                var lastBoxOffsetTop = that.oBoxs[that.oBoxs.length - 1].offsetTop+that.oBoxs[that.oBoxs.length-1].offsetHeight;
                if (lastBoxOffsetTop <= other.scrollTop() + other.clientHeight()) {
                    if(cb) cb();
                }
            };
        }
    };
    waterfall.prototype.init.prototype = waterfall.prototype;
    return waterfall;
});