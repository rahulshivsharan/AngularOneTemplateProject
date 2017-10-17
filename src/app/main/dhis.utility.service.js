(function(){
	'use strict';

	angular.module('EMU').service('utilityService', utilityService);

	utilityService.$inject = ["configParam","_"];

	function utilityService(configParam,_){
		var obj = {};

		var filterDataByYear = filterDataByYear;

		// public methods
		obj.processData = processData;

		return obj;

		function processData(){
			var selectedStates = undefined, filteredData = undefined;

			if(configParam.isNationalSelected === true){ // if National selected then select all states
				selectedStates = _.keys(configParam.statesObject);
				filteredData = filterDataByYear(selectedStates,"states");
			}else if(angular.isDefined(configParam.selectedDistricts) && angular.isArray(configParam.selectedDistricts) && configParam.selectedDistricts.length > 0){
				// is district selected than process data only for that perticular district
				filteredData = filterDataByYear(selectedDistricts,"districts");
			}else{
				// process data only for selected state
				filteredData = filterDataByYear(configParam.selectedStates,"states");
			} // end of else

			return filteredData;
		} // processData

		function filterDataByYear(selectedOptions,selectionType){
			var mainData = (selectionType === "states") ? configParam.statesObject : configParam.districtsObject;
			var mapForSelectedOptions = {};
			
			/*
				'mainData' contains key-value pairs for states/districts as key 
				and value is again a key-value with key as indicator and  value as array of indicators
				i.e.
				for 'Andaman and Nicobar' than mainData will be

				{
					"Andaman and Nicobar":{
						"IND1_C":[["IND1_C","2009","7"],....,["IND1_C","2017","330"]],
						"IND2_C" : [["IND2_C","2009","690"],...,["IND2_C","2017","751"]],
						...
				}
				
			*/

			// iterating through mainData 
			angular.forEach(mainData,function(value,key){ 
				// just to check if current iterating key i.e. state is present in selected state's array
				var index = _.findIndex(selectedOptions,function(stateName){
					return (key === stateName);
				}); 
				var selectedValArray = undefined; // selected districts/states
				if(index !== -1){ // if state is selected 
					mapForSelectedOptions[key] = [];	

					/*
						value will be
						{
						"IND1_C":[["IND1_C","2009","7"],....,["IND1_C","2017","330"]],
						"IND2_C" : [["IND2_C","2009","690"],...,["IND2_C","2017","751"]],
						....
						}

					*/
					selectedValArray = _.values(value); // get all the values
					
					/*
						selectedValArray will be
						[
							[["IND1_C","2009","7"],....,["IND1_C","2017","330"]],
							[["IND2_C","2009","690"],...,["IND2_C","2017","751"]],
							[["IND3_C","2009","697"],....["IND3_C","2017","1081"]],
							......
						]
					*/

					angular.forEach(selectedValArray,function(arr,indexVal){
						
						// filtering 'selectedValArray' for selected years
						angular.forEach(configParam.selectedYears,function(yearVal,i){
							var resultArray = _.filter(arr,function(arrayValue){
								return (arrayValue[1] === yearVal);
							});

							mapForSelectedOptions[key].push(resultArray[0]);
						});
												 
					});
					
															
				}// end if
			});
			return mapForSelectedOptions;
		} // filterDataByYear

	}// utilityService
})();