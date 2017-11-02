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
			config.processedDataByYear = undefined;

			config.abbreviation = {
				"madhya pradesh" : "MP",
				"uttar pradesh" : "UP"
			} 

			config.yearList = ["2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017"];

			config.indicators = ["IND1_C","IND2_C","IND3_C","IND25_C","IND30_C","IND31_C"];

			config.CYP_Factor = {
			    "IND1_C": 13, // Sterilization MALE 
			    "IND2_C": 13, // Sterilization FEMALE 
			    "IND3_C": 0.008333333, // Jadale Implant 
			    "IND25_C": 4.6,	// IUD
			    "IND30_C": 0.066666667, // Pill
			    "IND31_C": 0.008333333 // Condom Male    
			}

			config.facilities_adjustments_Factor = {
			    "IND1_C": 74.5,    // Sterilization MALE (Vasectomy (M))
			    "IND2_C": 74.5,    // Sterilization FEMALE (Tubal Ligation (F))
			    "IND3_C": 78.2,    // Jadale Implant           
			    "IND25_C": 64.3,   // IUCDs
			    "IND30_C": 39.6,   // Pills (Progestin Only Pills)    				     
			    "IND31_C": 23.7    // Male Condoms   
			}

			config.indicatorsMap = {
				"IND1_C" : "Sterilization Male",
				"IND2_C" : "Sterilization Female",
				"IND3_C" : "Jadelle - Implants (2-Rod)", //Implant,
				"IND25_C" : "Copper-T 380-A IUD (IUCD)", // IUD
				"IND30_C" : "Standard daily Pill", //Pills,
				"IND31_C" : "Male Condoms", //Condom Consumption
			}

			config.indicatorsLabel = {
				"IND31_C" : "Condom",
				"IND30_C" : "Pill",
				"IND25_C" : "IUD",
				"IND1_C" : "Sterilization",
				"IND3_C" : "Implant"
			}

			config.colorsPerLabel = {
			    "Condom" : "#D98880",
			    "Condoms" : "#D98880",
			    "Condoms (Male)" : "#D98880",
			    "Injectable" : "#884EA0",
			    "Implant" : "#5DADE2",
			    "Pill" : "#76D7C4",
			    "Pills" : "#76D7C4",
			    "OC Pills" : "#76D7C4",
			    "IUD" : "#F7DC6F",
			    "IUCD" : "#F7DC6F",
			    "Other" : "#D35400",
			    "Others" : "#D35400",
			    "Emergency Contraception": "#95A5A6",
			    "EC" : "#95A5A6",
			    "Sterilization" : "#23CA1E",
			    "Sterilization (Male)" : "#23CA1E",
			    "Sterilization (Female)" : "#D2B4DE",
			    "LAM" : "#979A9A",
			    "Any modern method" : "#23CDE2"
			}// end of colorsPerLabel

			return config;
		} // end of parameter
	}]);
})();