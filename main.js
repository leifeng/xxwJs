/**
 * Created by zcl on 14-9-16.
 */
require.config({
    baseUrl: "src/js/plug",
    paths: {
//        xxw: 'xxwjs.min',
//        xxwAjax: 'xxw_ajax_all.min',
//        xxwCookie: 'xxw_cookie_all.min',
//        xxwJson: 'xxw_json_all.min',
//        xxwAlert: 'xxw_alert.min',
        xxwOther: 'xxw_other_all',
//        xxwLunbo: 'xxw_lunbo.min',
        xxwFullPage: 'xxw_fpage_all',
//        xxwObserver: 'xxw_observer_all.min',
        xxwAnimation: 'xxw_animation_all'
//        xxwWaterfall: 'xxw_waterfall.min'
    }
});

require(['xxwFullPage'], function (fp) {
    var a = fp({
        panel: '#xxw_fp_main',
        afterScroll: function (i, page) {
        //    console.log(i, page);
        }

    });

});
