angular.module('SetController', []).controller('SetController', function($scope, $http, Set, $stateParams, $timeout, $location)  {
    // var keyG;
    // var validated = false;
    // $scope.$watch("key", function(val) {
    //     keyG = $scope.keycheck.key_input;
    // });

    //todo: do not retrieve content(images) same time as getting isProtected
    //
    // function getAlbum(guid, key) {
        Set.getAlbum($stateParams.guid).success(function(response){
            console.log(response.title);
            $scope.tagline = response.title;
            $scope.slides = response.images;
            $scope.numSlides = response.images.length;
            $scope.album_url = "#"+$location.path();
            $scope.album_description = response.description;
            $scope.image_height = $stateParams.height;
            $scope.image_width = $stateParams.width;
            // $scope.isProtected = response.isProtected;
            // if($scope.isProtected) {
            //     validated = false;
            // }
        });
        $scope.showURL = $stateParams.showURL;

        $scope.$evalAsync(function() {

            $timeout(function () {
                //$("figure").removeClass("bss-show");
                    var opts = {
                            //auto-advancing slides? accepts boolean (true/false) or object
                            auto : {
                                // speed to advance slides at. accepts number of milliseconds
                                speed : 5500,
                                // pause advancing on mouseover? accepts boolean
                                // pauseOnHover : true
                            },
                            // show fullscreen toggle? accepts boolean
                            // fullScreen : true,
                            // support swiping on touch devices? accepts boolean, requires hammer.js
                            //swipe : true
                        };

                    makeBSS('.bss-slides', opts);
             }, 1000);

        });
    // }
    //
    // if($scope.isProtected) {
    // }
    // $scope.isValidated = validated;
    // getAlbum($stateParams.guid, keyG);

});
// .run(['$rootScope', '$state', '$stateParams',
//   function ($rootScope, $state, $stateParams) {
//     $rootScope.$state = $state;
//     $rootScope.$stateParams = $stateParams;
// }])
// .run(['$rootScope', '$state', function($rootScope, $state) {
//     $rootScope.$on('$stateChangeStart', function(evt, to, params) {
//       if (to.redirectTo) {
//         evt.preventDefault();
//         $state.go(to.redirectTo, params)
//       }
//     });
// }]);
