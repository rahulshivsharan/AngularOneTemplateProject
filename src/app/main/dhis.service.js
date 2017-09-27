(function() {
    'use strict';
    angular.module('EMU').service('dhis', dhis);
    
    dhis.$inject = ['$http', 'AUTH', '$q'];
        
    function dhis($http, authHeader, $q) {
            
        var obj = {};

        return obj;
    }
    
})();
