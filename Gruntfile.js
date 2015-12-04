module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
        dist: {
            files: {
                'dist/add.js': 'js/add.js',
                'dist/edit.js': 'js/edit.js',
                'dist/list.js': 'js/list.js',
                'dist/login.js': 'js/login.js',
                'dist/notificationBar.js': 'js/notificationBar.js'
            }
        }
    },
    cssmin: {
      dist: {
          files: {
              'dist/forms.css': 'css/forms.css',
              'dist/list.css': 'css/list.css',
              'dist/login.css': 'css/login.css',
              'dist/welcome.css': 'css/welcome.css'
          }
      }
    },
    htmlmin: {
       dist: {
          options: {
             removeComments: true,
             collapseWhitespace: true
          },
          files: [{
             expand: true,
             cwd: 'src',
             src: '**/*.html',
             dest: 'dist/'
          }]
       }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin', 'htmlmin']);

};
