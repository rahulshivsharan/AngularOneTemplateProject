(function(){
	'use strict';

	angular.module('EMU').directive('inputDataTable',inputDataTable);

	inputDataTable.$inject = ["$compile"];

	function inputDataTable($compile){
		
		return {
			"restrict" : "EA",
			"scope" : {},
			"controller" : ["$scope","configParam",inputDataTableController],
			"controllerAs" : "vm",
			"templateUrl" : 'app/main/pages/inputPageDatatable.html'
 		};

 		function inputDataTableController($scope,configParam){
 			var vm = this;

 			// public variables
 			vm.tableHeaderArray = {};
 			vm.tableBodyArray = [];

 			// private methods 			
 			var init = init;
 			var createTableData = createTableData;
 			var createRowDataWithZeroValue = createRowDataWithZeroValue;

 			// call init
 			init();

 			function createRowDataWithZeroValue(obj){
 				angular.forEach(configParam.selectedYears,function(selectedYear,index){ 					
 					obj.values.push(0);
 				});
 				vm.tableBodyArray.push(tableRowObj);
 			}

 			function createTableData(indicatorName,isEmptyRow){

 				var tableRowObj = {
 					"method" : (isEmptyRow === true) ? indicatorName : configParam.indicatorsMap[indicatorName],
 					"cyp" : (isEmptyRow === true) ? "" : configParam.CYP_Factor[indicatorName], // cyp
 					"af" : (isEmptyRow === true) ? "" : configParam.facilities_adjustments_Factor[indicatorName], // Adjustment Factor
 					"values" : []
 				};


 				angular.forEach(configParam.selectedYears,function(selectedYear,index){ 					
 					var data = undefined;
 					//console.log(configParam.processedDataByYear);

 					console.log(_.result(_.find(configParam.processedDataByYear,function(obj){ 							
 						return parseInt(obj.year) === selectedYear;
 					}),"data"));

 					if(isEmptyRow === false){ 						
 						data = _.chain(configParam.processedDataByYear).find(function(obj){ 							 
 							return (parseInt(obj.year) === selectedYear);
 						}).thru(function(obj){
 							return obj.data;
 						}).find(function(obj){
 							return (obj.dataSetId === indicatorName); 
 						}).value();
 								
 						tableRowObj.values.push(data["calculatedAmount"]);		
 					}else{
 						tableRowObj.values.push("");
 					} // end of else

 					vm.tableBodyArray.push(tableRowObj);
 				});
 			} // end of createTableData
 			
 			function init(){
 				vm.tableHeaderArray = {
 					"Method" : "Method",
 					"CYP" : "CYP",
 					"af" : "Adjustment for Private Sector",
 					"values" : []
 				}

 				angular.forEach(configParam.selectedYears,function(selectedYear,index){
 					var prevYear = 0;
 					if((typeof selectedYear) === "string"){
 						selectedYear = parseInt(selectedYear);
 					}
 					prevYear = selectedYear - 1;
 					selectedYear = prevYear + "-" + selectedYear;
 					vm.tableHeaderArray.values.push(selectedYear);
 				});

 				
 				createTableData("Steralization",true);
 				createTableData("INDC_1",false);
 				createTableData("INDC_2",false);
 				createTableData("IUD",true);
 				createTableData("IND25_C",false);


 				createRowDataWithZeroValue({
 					"method" : "LNG-IUS",
 					"cyp" : 3.3,
 					"af" : 0,
 					"values" : []
 				});		

 				createTableData("Implant",true);

 				createRowDataWithZeroValue({
 					"method" : "Implanon - Implants (1-Rod)",
 					"cyp" : 2.5,
 					"af" : 78.2,
 					"values" : []
 				});

 				createTableData("IND3_C",false);

 				createRowDataWithZeroValue({
 					"method" : "Sino-Implant",
 					"cyp" : 3.2,
 					"af" : 0,
 					"values" : []
 				});

 				
 				
 				createTableData("Injectable",true);

 				createRowDataWithZeroValue({
 					"method" : "Depo Provera (DMPA)",
 					"cyp" : 0.25,
 					"af" : 62.7,
 					"values" : []
 				});

 				

 				createRowDataWithZeroValue({
 					"method" : "Noristerat (NET-En)",
 					"cyp" : 0.166666667,
 					"af" : 0,
 					"values" : []
 				});				

 				createRowDataWithZeroValue({
 					"method" : "Lunelle",
 					"cyp" : 0.076923077,
 					"af" : 0,
 					"values" : []
 				});				

 				createRowDataWithZeroValue({
 					"method" : "Sayana Press",
 					"cyp" : 0.25,
 					"af" : 0,
 					"values" : []
 				});				

 				createRowDataWithZeroValue({
 					"method" : "Other Injectable",
 					"cyp" : 0.25,
 					"af" : 62.7,
 					"values" : []
 				}); 				
 				
 				createTableData("Pill",true);
 				createTableData("IND30_C",false);

 				createRowDataWithZeroValue({
 					"method" : "Progestin only Pill",
 					"cyp" : 0.066666667,
 					"af" : 39.6,
 					"values" : []
 				});

 				createRowDataWithZeroValue({
 					"method" : "Peri-coital contraception",
 					"cyp" : 0.066666667,
 					"af" : 0,
 					"values" : []
 				}); 

 				createTableData("Condom",true);
 				createTableData("IND31_C",false);

 				createRowDataWithZeroValue({
 					"method" : "Female Condom",
 					"cyp" : 120,
 					"af" : 23.7,
 					"values" : []
 				});
 				createTableData("Other",true);
 				createRowDataWithZeroValue({
 					"method" : "LAM",
 					"cyp" : 4,
 					"af" : 0,
 					"values" : []
 				});
 				createRowDataWithZeroValue({
 					"method" : "SDM (Standard Days) / Cycle Beads",
 					"cyp" : 1.5,
 					"af" : 74.5,
 					"values" : []
 				});
 				createRowDataWithZeroValue({
 					"method" : "Vaginal barrier",
 					"cyp" : 1,
 					"af" : 0,
 					"values" : []
 				});
 				createRowDataWithZeroValue({
 					"method" : "Spermicides",
 					"cyp" : 120,
 					"af" : 0,
 					"values" : []
 				});
 				createTableData("Emergency contraceptions",true);
 				createRowDataWithZeroValue({
 					"method" : "Emergency contraception",
 					"cyp" : 20,
 					"af" : 23.7,
 					"values" : []
 				});
 			} // end of init

 		}// end of inputDataTableController

	} // end of inputDataTable
})();