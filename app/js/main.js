(function() {

    'use strict';

    require('angular');
    require('angular-route');
    require('angular-animate');

    // Controllers
    var HomeCtrl = require('./controllers/home.js');
    var Page1Ctrl = require('./controllers/page1ctrl.js');
    var Page2Ctrl = require('./controllers/page2ctrl.js');

    // Directives
    var CardDirective = require('./directives/card.js');

    // Services
    var User = require('./services/service.js')

    angular.module('SampleApp', ['ngRoute', 'ngAnimate'])

    .config([

        '$locationProvider',
        '$routeProvider',
        function($locationProvider, $routeProvider) {

            // routes
            $routeProvider
                .when("/", {

                    templateUrl: "./partials/home.html",
                    controller: "HomeController"
                })
                .when("/page1", {

                    templateUrl: "./partials/page1.html",
                    controller: "Page1Controller"
                })
                .when("/page2", {

                    templateUrl: "./partials/page2.html",
                    controller: "Page2Controller"
                })
                .otherwise({
                    redirectTo: '/'
                });

            $locationProvider.html5Mode({

                enabled: true,
                requireBase: false
            }).hashPrefix('!');

        }

    ])


    // Initialize controller
    .controller('Page1Controller', Page1Ctrl) // utilizes angular services

    .controller('Page2Controller', Page2Ctrl)

    .controller('HomeController', HomeCtrl)

    // Initialize directive
    .directive('card', CardDirective)

    // Initialize Services
    .service('UserService', User);

}());
