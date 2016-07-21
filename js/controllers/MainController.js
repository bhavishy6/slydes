angular.module('MainController', []).controller('MainController', function($scope, $http, Main) {

    Main.getAlbums().success(function (albums) {
        console.log("success getting titles:  " + albums);
        $scope.albums = albums;
        
    });

    $scope.tagline = 'To the moon and back!';

});
