(function() {
    'use strict';
    angular.module('EMU').service('dhis', dhis);
    
    dhis.$inject = ['$http', '$q', "BACKEND_URL"];
        
    function dhis($http, $q, BACKEND_URL) {
            
        var obj = {};

        obj.getDistricts = getDistricts;

        return obj;

        function getDistricts(){
        	var callbackFn = callbackFn;
        	return $q(callbackFn);

        	function callbackFn(resolve,reject){
        		resolve();
        	}// end of callbackFn
        }// end of getDistricts
    } // end of dhis
    
})();
