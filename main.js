/**
 * Created by zcl on 14-9-16.
 */
require.config({
    baseUrl: "bulid/js/plug",
    paths: {
        xxw: 'xxwjs.min',
        //xxwAjax: 'xxw_ajax_all.min',
        //xxwCookie: 'xxw_cookie_all.min',
        //xxwJson: 'xxw_json_all.min',
        xxwAlert: 'xxw_alert.min',
        xxwOther: 'xxw_other_all.min',
        xxwLunbo: 'xxw_lunbo.min',
        xxwObserver: 'xxw_observer_all.min'
    }
});

require(['xxwObserver'], function (ob) {


});