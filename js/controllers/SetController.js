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
            $scope.slides.forEach(function(slide) {
                var img_width = slide.width;
                var img_height = slide.height;

                // var new_width = greatestMultiple(1, img_width/$stateParams.width, $stateParams.width);
                var new_width = ($stateParams.width/100) * img_width
                // var new_height = greatestMultiple(1, img_height/$stateParams.height, $stateParams.height);
                var new_height = ($stateParams.height/100) * img_height;

                slide.width = new_width;
                slide.height = new_height;

                console.log("greatestMultipleWidth " + new_width);
                console.log("greatestMultipleHeight " + new_height);
                // console.log("orig h: " + slide.height);
                // console.log("req h: " + $stateParams.height);
                //
                // if(slide.width = 2448) {
                //     while(new_width < $stateParams.width && (new_width % img_width == 0)) {
                //         $scope.image_width += img_width/$stateParams.width;
                //     }
                // } else if(slide.width = 3264) {
                //     while(new_width < $stateParams.width && (new_width % img_width == 0)) {
                //         $scope.image_width += img_width/$stateParams.width;
                //     }
                // }
                // console.log("Width: " + $scope.image_width);
                //
                // if($scope.image_height = 2448) {
                //     while(new_width < $stateParams.height && (new_width % img_width == 0)) {
                //         new_width +=  img_width/$stateParams.height;
                //     }
                // } else if($scope.image_height = 3264) {
                //     while(new_width < $stateParams.height && (new_width % img_width == 0)) {
                //         new_width += img_height/$stateParams.height;
                //     }
                // }
                // console.log("22Height: " + $scope.image_height);
            });
            $scope.numSlides = response.images.length;
            $scope.album_url = "#"+$location.path();
            $scope.album_description = response.description;
            $scope.image_height = new_height;
            $scope.image_width = new_width;
            // $scope.isProtected = response.isProtected;
            // if($scope.isProtected) {
            //     validated = false;
            // }
        });

        var greatestMultiple = function(start, multiple ,max) {
            while(start < max) {
                start = start * multiple;
                if(start > max) {
                    return start;
                }
                console.log(start);
            }
            return start;
        }
        //image resizing 3264 × 2448
        $scope.showURL = $stateParams.showURL;
        if($stateParams.showURL) {
            $('nav.navbar').remove();
        }

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
