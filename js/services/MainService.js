angular.module('MainService', [])

.factory('Main', function($http) {
    return {
        getAlbums : function() {
            return $http({
                url:'/get_albums',
                method: 'GET'
            });
        },
            // these will work when more API routes are defined on the Node side of things
    // call to POST and create a new nerd

    };
});
