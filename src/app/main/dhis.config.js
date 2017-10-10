(function(){
	'use strict';
	
	angular.module("EMU").config(["$provide",function($provide){
		$provide.factory("configParam",configParam);

		function configParam(){
			var config = {};

			config.abbreviation = {
				"madhya pradesh" : "MP",
				"uttar pradesh" : "UP"
			} 

			return config;
		} // end of parameter
	}]);
})();