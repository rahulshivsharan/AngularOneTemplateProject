(function(){
	'use strict';

	angular.module('EMU').service('utilityService', utilityService);

	utilityService.$inject = ["configParam","_"];

	function utilityService(configParam,_){
		var obj = {};

		var filterDataByYear = filterDataByYear;
		var aggregateDataByIndicators = aggregateDataByIndicators;

		// public methods
		obj.processData = processData;

		return obj;

		function aggregateDataByIndicators(data){
			var finalArrayData = [];

			// 'data' contains key-value, where key can be selected state/district
			// and value are array of array.
			// example 
			// {
			// 	"Uttar Pradesh" : [
			// 							[],[],[]
			// 						],
			// 	"Bihar" : [ [],[],[] ]					
			// }

			// I want to get only the first key-value's value of above data,
			// i.e. only value of 'Uttar Pradesh' 
			var arrayOfData = _.values(data)[0];

			angular.forEach(configParam.selectedYears,function(selectedYear,index){
				
				angular.forEach(arrayOfData,function(arr,index){
						var selectedIndicator = undefined,
							populationCount = 0;
						
						var count = 0;
						var selectedArrayData = undefined;

						if(arr[1] === selectedYear){

							selectedIndicator = arr[0];
							populationCount = parseInt(arr[2]);
						

						

							for(var s in data){
								count++;
								if(count === 1){
									continue;
								}else{
									selectedArrayData = data[s];

									for(var x = 0; x < selectedArrayData.length; x++){
										if((function(arr_data,yr,indicator){
											var isFound = false;
											if(arr_data[1] === yr && arr_data[0] === indicator){
												populationCount +=  parseInt(arr_data[2]);
												isFound = true;
											}

											return isFound;
										})(selectedArrayData[x],selectedYear,selectedIndicator) === true){
											break;
										}
									}
								}// end of else
							}// end of for

							finalArrayData.push([ arr[0], arr[1], populationCount]);

						} // end of if	
				});
				
			});

			return finalArrayData;
		}// end of aggregateDataByIndicators

		function processData(){
			var selectedStates = undefined,
				selectedDistricts = undefined, 
				filteredData = undefined;

			if(configParam.isNationalSelected === true){ // if National selected then select all states
				selectedStates = _.keys(configParam.statesObject);
				filteredData = filterDataByYear(selectedStates,"states");
			}else if(angular.isDefined(configParam.selectedDistricts) && angular.isArray(configParam.selectedDistricts) && configParam.selectedDistricts.length > 0){
				// is district selected than process data only for that perticular district				
				filteredData = filterDataByYear(configParam.selectedDistricts,"districts");
			}else{
				// process data only for selected state
				filteredData = filterDataByYear(configParam.selectedStates,"states");
			} // end of else
			
			console.log(filteredData);
			
			return aggregateDataByIndicators(filteredData);
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