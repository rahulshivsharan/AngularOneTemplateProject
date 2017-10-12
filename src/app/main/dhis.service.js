(function() {
    'use strict';
    angular.module('EMU').service('dhisService', dhisService);
    
    dhisService.$inject = ['$http', '$q', "BACKEND_URL"];
        
    function dhisService($http, $q, BACKEND_URL) {
            
        var obj = {};
		// obj.statesObject = undefined;
		// obj.districtsObject = undefined;
		// obj.selectedStates = [];
		// obj.selectedDistricts = [];

		obj.getStates = getStates;
		obj.getDistricts = getDistricts;

		return obj;

		function getStates(){
			var deferred = $q.defer();
			var url = "assets/data/Country.India.json";
			
			$http.get(url).then(success,error);

			return deferred.promise;

			function success(data){
				deferred.resolve(data);
			}

			function error(error){
				deferred.reject(error);
			}
		} // getStates

		function getDistricts(states){
			var url = "assets/data/State."+states+".json";
			var deferred = $q.defer();

			$http.get(url).then(success,error);

			return deferred.promise;

			function success(data){
				deferred.resolve(data);
			}

			function error(error){
				deferred.reject(error);
			}
		} // getDistricts

    } // end of dhis
    
})();
