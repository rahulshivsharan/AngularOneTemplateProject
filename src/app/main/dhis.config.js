(function(){
	'use strict';
	
	angular.module("EMU").config(["$provide",function($provide){
		$provide.factory("configParam",configParam);

		function configParam(){
			var config = {};

			config.statesObject = undefined;
			config.districtsObject = undefined;
			config.selectedStates = [];
			config.selectedDistricts = [];
			config.selectedYears = [];
			config.isNationalSelected = false;

			config.abbreviation = {
				"madhya pradesh" : "MP",
				"uttar pradesh" : "UP"
			} 

			config.yearList = ["2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017"];

			config.indicators = ["IND1_C","IND2_C","IND3_C","IND25_C","IND30_C","IND31_C"];

			return config;
		} // end of parameter
	}]);
})();