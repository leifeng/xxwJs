/**
 * Created by chuanlong on 2014/9/17.
 *
 *
 *     Alert({
        title: 'title',
        body: 'xxxxxxxxxx56rfhgsdfghsdrgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgxxxxxxxxxxxxxx',
        confirm:true,
        cb:function(data){
          alert(data);
        }
    });

 */
'use strict';
define(['xxwOther'], function (other) {
    var Alert = function (options) {
        return new Alert.prototype.init(options);
    };
    Alert.prototype = {
        init: function (options) {
            var defaults = {
                w: 300,
                h: 300,
                title: '标题',
                body: '内容',
                mask: false,//是否有遮照
                confirm: false,  //是否需要确认
                cb: null
            };
            this.defaults = other.extend(defaults, options);
            this.makeDom();
        },
        makeDom: function () {
            var obj, main, title, body, a, span, left;
            left = (other.clientWidth / 2 - this.defaults.w / 2);
            obj = other.$$('#xxw_Alert');
            if (!obj) {
                main = document.createElement('div');
                title = document.createElement('div');
                body = document.createElement('div');
                span = document.createElement('span');
                a = document.createElement('a');
                document.body.appendChild(main);
                title.appendChild(span);
                title.appendChild(a);
                main.appendChild(title);
                main.appendChild(body);
                main.id = 'xxw_Alert';
                main.className = 'xxw_Alert xxw_ie6fixedTL';
                title.className = 'alert_title';
                body.className = 'alert_body';
                a.className = 'alert_close';
                main.style.cssText = 'width:' + this.defaults.w + 'px;left:' + left + 'px';
                span.innerText = span.textContent = this.defaults.title;
                body.innerText = body.textContent = this.defaults.body;
                a.innerText = a.textContent = '关闭';
                other.addEvent(a, 'click', function () {
                    main.className='xxw_Alert xxw_hide';
                });
                this.makeConfirm(main);
            }
        },
        makeConfirm: function (main) {
            if (!this.defaults.confirm) {
                return;
            }
            if (typeof this.defaults.cb !== 'function') {
                alert('错误：交互功能需要回调cb');
                return;
            }
            var confirm, yes, no,that;
            that=this;
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
            main.appendChild(confirm);
            other.addEvent(yes, 'click', function () {
                main.className='xxw_Alert xxw_hide';
                that.defaults.cb('yes');
            });
            other.addEvent(no, 'click', function () {
                main.className='xxw_Alert xxw_hide';
                that.defaults.cb('no');
            });
        }
    };
    Alert.prototype.init.prototype = Alert.prototype;
    return Alert;
});
