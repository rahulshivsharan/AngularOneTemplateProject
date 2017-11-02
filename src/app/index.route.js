(function() {
    'use strict';

    angular
        .module('EMU')
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('setup', {
                url: '/setup',
                templateUrl: 'app/main/pages/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            }).state('home', {
                url: '/',
                templateUrl: 'app/main/pages/home.html',
                controller: 'HomeController',
                controllerAs: 'home'
            }).state('input', {
                url: '/input',
                templateUrl: 'app/main/pages/inputData.html',
                controller: 'InputPageController',
                controllerAs: 'vm'
            }).state('output', {
                url: '/output',
                templateUrl: 'app/main/pages/outputData.html',
                controller: 'OutputPageController',
                controllerAs: 'vm'
            });

        $urlRouterProvider.otherwise('/');
    }

})();
