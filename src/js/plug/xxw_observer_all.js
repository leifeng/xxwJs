/**
 * Created by chuanlong on 2014/9/17.
 *
 *
 var p = new xxw.ps;
 p.sub('b', function (a) {
     alert(a);
 });
 p.pub('a','text');
 */

define(function () {
    'use strict';
    var observer = function () {
        this.id = 0;
        this._event = {};
    };
    observer.prototype.sub = function (n, f) {
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
    observer.prototype.pub = function (n, arr) {
        if (!this._event[n]) return;
        for (var i = 0; i < this._event[n].length; i++) {
            this._event[n][i].fn(arr);
        }
    };
    observer.prototype.unsub = function (n) {
        if (typeof n == 'number') {
            for (var key in this._event) {
                for (var i = 0; i < this._event[key].length; i++) {
                    if (this._event[key].id === n) {
                        delete this._event[key];
                    }
                }
            }
        } else {
            delete this._event[n];
        }
    };
    return observer;
});