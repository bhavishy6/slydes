angular.module('appRoutes', ['ui.router'])
.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('common', {
            templateUrl: 'common.html',
            abstract: true
        })
        .state('set', {
            url: '/set/:guid?height&width&showURL',
            templateUrl: 'templates/set.html',
            controller: 'SetController'
        })
        .state('enter_set', {
            url: '/enter_set/:guid',
            templateUrl: 'templates/checkset.html',
            controller: 'CheckSetController'
        })
        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller: 'MainController'
        });

    $urlRouterProvider.otherwise('/home');
}]);
