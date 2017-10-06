(function(){
	'use strict';
	
	angular.module("EMU").config(["$provide",function($provide){
		$provide.factory("parameters",parameters);

		function parameters(){
			var obj = {};

			obj.getStates = getStates;
			obj.getDistricts = getDistricts;

			return obj;

			function getStates(){

			} // getStates

			function getDistricts(){

			} // getDistricts
			
		} // end of parameter
	}]);
})();