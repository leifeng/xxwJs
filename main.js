/**
 * Created by zcl on 14-9-16.
 */
require.config({
    baseUrl: "bulid/js/plug",
    paths: {
        xxw: 'xxwjs.min',
        xxwAjax:'xxw_ajax_all.min',
        xxwCookie:'xxw_cookie_all.min'
    }
});

require(['xxw','xxwAjax','xxwCookie'], function($,ajax,cookie) {
    console.log($('#lm'))
    ajax({
        url:'test.html'
    },function(data){
        console.log(data)
    });
    cookie.set('a','1',1)
});