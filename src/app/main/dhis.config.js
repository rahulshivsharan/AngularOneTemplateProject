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

			config.yearList = ["2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017"];

			return config;
		} // end of parameter
	}]);
})();