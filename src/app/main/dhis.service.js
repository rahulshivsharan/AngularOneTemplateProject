(function() {
    'use strict';
    angular.module('EMU').service('dhis', dhis);
    
    dhis.$inject = ['$http', '$q', "BACKEND_URL"];
        
    function dhis($http, $q, BACKEND_URL) {
            
        var obj = {};

        return obj;
    }
    
})();
