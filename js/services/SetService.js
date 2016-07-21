angular.module('SetService', [])

.factory('Set', function($http) {
		return {
			getAlbum : function(guid) {
				return $http({
                    url: "/album",
                    method: "GET",
                    params: { url: guid }
				});
			},
                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
    };

});
