angular.module('CheckSetService', [])

.factory('CheckSet', function($http) {
    return {
        check_album_protect : function(guid) {
            return $http({
                url: "/check_album_protect",
                method: "GET",
                params: {url: guid}
            });
        },
    };
});
