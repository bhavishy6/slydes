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
            url: '/set/:guid',
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


// .config([
//     '$urlMatcherFactoryProvider', function($urlMatcherFactoryProvider) {
//         var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//             var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//             return v.toString(16);
//         });
//         $urlMatcherFactoryProvider.type('guid', {
//             encode: angular.identity,
//             decode: angular.identity,
//             is: function(item) {
//                return guid.test(item);
//             }
//         });
// }])
