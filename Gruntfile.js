/**
 * Created by zcl on 14-9-16.
 */
'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author%>*/\n'
            },
            static_mappings: {
                files: [
                    {src: 'src/js/require.js', dest: 'bulid/js/require.min.js'}
                ]
            },
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js/',
                        src: 'plug/*.js',
                        dest: 'bulid/js/',
                        ext: '.min.js'
                    }
                ]
            }
        },
        cssmin: {
            css:{
                files: [
                    {
                        expand: true,
                        cwd: 'src/css/',
                        src: '*.css',
                        dest: 'bulid/css/',
                        ext: '.min.css'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['uglify', 'cssmin']);
}

