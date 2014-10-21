/**
 * Created by zcl on 14-9-16.
 */
require.config({
    baseUrl: "build/js/plug",
    paths: {
//        xxw: 'xxwjs.min',
//        xxwAjax: 'xxw_ajax_all.min',
//        xxwCookie: 'xxw_cookie_all.min',
//        xxwJson: 'xxw_json_all.min',
//        xxwAlert: 'xxw_alert.min',
        xxwOther: 'xxw_other_all.min',
//        xxwLunbo: 'xxw_lunbo.min',
//        xxwObserver: 'xxw_observer_all.min',
//        xxwAnimation: 'xxw_animation_all',
        xxwWaterfall: 'xxw_waterfall.min'
    }
});

require(['xxwWaterfall'], function (water) {
    water({
        resize: true,
        scroll: true,
        list: [
            {src: 'http://img1.0372.cn:83/201410/20141015022447.jpg', title: ''},
            {src: 'http://img1.0372.cn:83/201409/20140923091310.jpg', title: ''},
            {src: 'http://img1.0372.cn:83/201410/20141014021844.jpg', title: ''},
            {src: 'http://img1.0372.cn:83/201410/20141014092015.jpg', title: ''},
            {src: 'http://img1.0372.cn:83/201410/20141014021444.jpg', title: ''},
            {src: 'http://img1.0372.cn:83/201410/20141008052213.jpg', title: ''},
            {src: 'http://img1.0372.cn:83/201409/20140929051238.jpg', title: ''},
            {src: 'http://img1.0372.cn:83/201410/20141010095111.jpg', title: ''},
            {src: 'http://img1.0372.cn:83/201410/20141017093538.jpg', title: ''}
        ]}, function () {
        alert('a')
    });

});