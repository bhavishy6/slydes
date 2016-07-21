angular.module('CheckSetController', []).controller('CheckSetController', function($scope, $http, CheckSet, $stateParams)  {
    $scope.keyForm = {};

    function checkProtect(guid) {
        return CheckSet.check_album_protect(guid).success(function(response){
            $scope.tagline = response.title;
            $scope.slides = response.images;
            $scope.numSlides = response.images.length;
        });
    }



    $scope.isProtected = checkProtect($stateParams.guid);
    $scope.validate = function validateRequest() {

    }
});
