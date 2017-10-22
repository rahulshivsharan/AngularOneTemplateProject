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
			config.processedData = undefined;

			config.abbreviation = {
				"madhya pradesh" : "MP",
				"uttar pradesh" : "UP"
			} 

			config.yearList = ["2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017"];

			config.indicators = ["IND1_C","IND2_C","IND3_C","IND25_C","IND30_C","IND31_C"];

			config.CYP_Factor = {
			    "IND1_C": 13, //Sterilization MALE 
			    "IND2_C": 13, // Sterilization FEMALE 
			    "IND3_C": 0.008333333, // Jadale Implant 
			    "IND25_C": 4.6,	// IUD
			    "IND30_C": 0.066666667, // Pill
			    "IND31_C": 0.008333333 // Condom Male    
			}

			config.facilities_adjustments_Factor = {
			    "IND1_C": 74.5,    // Sterilization MALE
			    "IND2_C": 74.5,    // Sterilization FEMALE
			    "IND3_C": 78.2,    // Jadale Implant           
			    "IND25_C": 64.3,   // IUCDs
			    "IND30_C": 39.6,   // Pills    
			    "IND30_C": 39.6,   // Progestin Only Pills  
			    "IND31_C": 23.7    // Male Condoms   
			}

			return config;
		} // end of parameter
	}]);
})();