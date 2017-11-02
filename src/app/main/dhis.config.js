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


			//Population for Each year for India - wpp values for India
			config.wpp = { // New value
			    "2005" : 208124275,
			    "2006" : 211925286,
			    "2007" : 215683580,
			    "2008": 219392007,
			    "2009": 223043414,
			    "2010": 226630653,
			    "2011": 230146570,
			    "2012": 233584016,
			    "2013": 236935839,
			    "2014": 240194889,
			    "2015": 243354014,
			    "2016": 246406064,
			    "2017": 249343887
			} // end of wpp

			config.populationForZones = {
			    "Uttar Pradesh" : {
			        "2005" : 31275379,
			        "2006" : 31856808,
			        "2007" : 32449046,
			        "2008" : 33052294,
			        "2009" : 33666756,
			        "2010" : 34292642,
			        "2011" : 34411138,
			        "2012" : 34835779,
			        "2013" : 35265662,
			        "2014" : 35700849,
			        "2015" : 36141406,
			        "2016" : 36587400,
			        "2017" : 37038897
			    },
			    "Bihar" : {
			        "2005" : 18460447,
			        "2006" : 19195035,
			        "2007" : 19929623,
			        "2008" : 20664211,
			        "2009" : 21398799,
			        "2010" : 22133386,
			        "2011" : 22867974,
			        "2012" : 23602562,
			        "2013" : 24337150,
			        "2014" : 25071738,
			        "2015" : 25806326,
			        "2016" : 26540914,
			        "2017" : 27275502
			    }
			} // end of config.populationForZones

			return config;
		} // end of parameter
	}]);
})();