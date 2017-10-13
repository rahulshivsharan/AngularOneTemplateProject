(function(){
	'use strict';
	angular.module('EMU').service('utilityService', utilityService);

	utilityService.$inject = ["$scope","configParam","_"]

	function utilityService($scope,configParam,_){
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
			
			angular.forEach(mainData,function(value,key){ // iterating through all districts/states
				var index = _.findIndex(selectedOptions,key), selectedValArray = undefined; // selected districts/states
				if(index !== -1){
					mapForSelectedOptions[key] = [];	
					selectedValArray = value;
					var filteredArray = _.filter(selectedValArray,function(arr){
						var idx = _.findIndex(config.selectedYears,arr[1]);						
						return (config.selectedYears[idx] === arr[1]);						 
					});
					mapForSelectedOptions[key].push(filteredArray);										
				}// end if
			});
			return mapForSelectedOptions;
		} // processData
	}// utilityService
})();