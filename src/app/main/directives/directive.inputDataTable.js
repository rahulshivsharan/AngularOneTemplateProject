(function(){
	'use strict';
	angular.module('EMU').directive('inputDataTable',inputDataTable);

	function inputDataTable(){
		
		return {
			"restrict" : "EA",
			"scope" : {},
			"controller" : ["$scope","configParam","$q",inputDataTableController],
			"controllerAs" : "vm",
			"templateUrl" : 'app/main/pages/inputPageDatatable.html'
 		};

 		function inputDataTableController($scope,configParam,$q){
 			var vm = this;

 			// public variables
 			vm.tableHeaderArray = {};
 			vm.tableBodyArray = [];
 			vm.dtOptions = {};

 			// private methods 			
 			var init = init;
 			var createTableData = createTableData;
 			var createRowDataWithZeroValue = createRowDataWithZeroValue;

 			// call init
 			init();

 			function createRowDataWithZeroValue(obj){
 				var deferred = $q.defer();
 				angular.forEach(configParam.selectedYears,function(selectedYear,index){ 					
 					obj.values.push(0);
 				}); 				
 				deferred.resolve(obj);
 				return deferred.promise;
 			}// end of createRowDataWithZeroValue

 			function createTableData(indicatorName,methodType){
 				var deferred = $q.defer();
 				var tableRowObj = {
 					"methodType" : methodType,
 					"method" : configParam.indicatorsMap[indicatorName],
 					"cyp" :  configParam.CYP_Factor[indicatorName], // cyp
 					"af" :  configParam.facilities_adjustments_Factor[indicatorName], // Adjustment Factor
 					"values" : []
 				};


 				angular.forEach(configParam.selectedYears,function(selectedYear,index){ 					
					/*
						below code runs for selected years.
						I am using library lodash's chaining as to use chain of utility methods
						one after the other on data.

						First I find using selected Year.
						then find using indicator
					*/ 					
 					var data = _.chain(configParam.processedDataByYear).find(function(obj){ 							 
 						return obj.year == selectedYear; // find by year
 					}).thru(function(obj){
 						return obj.data;
 					}).find(function(obj){
 						return obj.dataSetId == indicatorName; // find by indicator
 					}).value();
 								
 					
 					tableRowObj.values.push(data["amount"]);		 					 					
 				});

 				
 				deferred.resolve(tableRowObj);
 				return deferred.promise;
 			} // end of createTableData
 			
 			function init(){
 				vm.tableHeaderArray = {
 					"MethodType" : "MethodType",
 					"Method" : "Method",
 					"CYP" : "CYP",
 					"af" : "Adjustment for Private Sector",
 					"values" : []
 				};

 				/*
					'dtOptions' is passed as data-table options,
					the options contain datatable column grouping configuration.
					The datatable renderred by this directive is grouped by 'methodType'.
					And the column 'MethodType' is kept hidden.
					column 'MethodType' is first column of datatable with index 0.
 				*/
 				vm.dtOptions = {
 					columnDefs: [
            			{ "visible": false, "targets": 0 }
        			],
 					drawCallback : function(settings){
 						var api = this.api();
			            var rows = api.rows( {page:'current'} ).nodes();
			            var last = null;

			            api.column(0,{ page: 'current' }).data().each(function(group,i) {
			            	var colspanLength = 3 + configParam.selectedYears.length;
			                
			                if(last !== group) {
			                    
			                    $(rows).eq(i).before(
			                        "<tr class='group'><td colspan='"+colspanLength+"''>"+group+"</td></tr>"
			                    );
			 
			                    last = group;
			                }// if
            			});

 					}// end of drawCallback
 				};

 				/*
					data-table header-row creation.
					The header row is dynamic as it depends on 
					number of selected years.
 				*/
 				angular.forEach(configParam.selectedYears,function(selectedYear,index){
 					var prevYear = 0;
 					if((typeof selectedYear) === "string"){
 						selectedYear = parseInt(selectedYear);
 					}
 					prevYear = selectedYear - 1;
 					selectedYear = prevYear + "-" + selectedYear;
 					vm.tableHeaderArray.values.push(selectedYear);
 				});

 					
 				/*
 					The below block of code is method calls for method's 
 					'createTableData' and 'createRowDataWithZeroValue'.
 					method 'createTableData' is renderred with values where as 
 					method 'createRowDataWithZeroValue' renders row with zero values.

 					Promise's are used in each of above mentioned methods
 					and these Promises have to be resolved synchronously
 					as the row data has to be renderred in order.

 					The reason behind usage of Promise's is, some of the row's were
 					not getting renderred in order, hence using Promises.

 					I need to further look into below code as in whether I 
 					can further optimise the code below, or whether I can remove the use
 					of promise as these are not ajax calls.
 				*/	
 				createTableData("IND1_C","Steralization").then(function(rowObj){
 					vm.tableBodyArray.push(rowObj);
 					createTableData("IND2_C","Steralization").then(function(rowObj){
 						vm.tableBodyArray.push(rowObj);
 						createTableData("IND25_C","IUD").then(function(rowObj){
 							vm.tableBodyArray.push(rowObj);
 							createRowDataWithZeroValue({
 								"methodType" : "IUD",
						 		"method" : "LNG-IUS",
				 				"cyp" : 3.3,
				 				"af" : 0,
				 				"values" : []
						 	}).then(function(rowObj){
						 		vm.tableBodyArray.push(rowObj);
						 		createRowDataWithZeroValue({
						 			"methodType" : "Implant",
							 		"method" : "Implanon - Implants (1-Rod)",
							 		"cyp" : 2.5,
							 		"af" : 78.2,
							 		"values" : []
							 	}).then(function(rowObj){
							 		vm.tableBodyArray.push(rowObj);
							 		createTableData("IND3_C","Implant").then(function(rowObj){
							 			vm.tableBodyArray.push(rowObj);
							 			createRowDataWithZeroValue({
											"methodType" : "Implant",
											"method" : "Sino-Implant",
											"cyp" : 3.2,
											"af" : 0,
											"values" : []
										}).then(function(rowObj){
											vm.tableBodyArray.push(rowObj);
											createRowDataWithZeroValue({
												"methodType" : "Injectable",
												"method" : "Depo Provera (DMPA)",
												"cyp" : 0.25,
												"af" : 62.7,
												"values" : []
											}).then(function(rowObj){
												vm.tableBodyArray.push(rowObj);
												createRowDataWithZeroValue({
													"methodType" : "Injectable",
													"method" : "Noristerat (NET-En)",
													"cyp" : 0.166666667,
													"af" : 0,
													"values" : []
												}).then(function(rowObj){
													vm.tableBodyArray.push(rowObj);
													createRowDataWithZeroValue({
														"methodType" : "Injectable",
														"method" : "Lunelle",
													 	"cyp" : 0.076923077,
													 	"af" : 0,
													 	"values" : []
													}).then(function(rowObj){
														vm.tableBodyArray.push(rowObj);
														createRowDataWithZeroValue({
															"methodType" : "Injectable",
															"method" : "Sayana Press",
															"cyp" : 0.25,
															"af" : 0,
															"values" : []
														}).then(function(rowObj){
															vm.tableBodyArray.push(rowObj);
															createRowDataWithZeroValue({
																"methodType" : "Injectable",
																"method" : "Other Injectable",
																"cyp" : 0.25,
																"af" : 62.7,
																"values" : []
															}).then(function(rowObj){
																vm.tableBodyArray.push(rowObj);
																createTableData("IND30_C","Pill").then(function(rowObj){
																	vm.tableBodyArray.push(rowObj);
																	createRowDataWithZeroValue({
																		"methodType" : "Pill",
																		"method" : "Peri-coital contraception",
																		"cyp" : 0.066666667,
																		"af" : 0,
																		"values" : []
																	}).then(function(rowObj){
																		vm.tableBodyArray.push(rowObj);
																		createTableData("IND31_C","Condom").then(function(rowObj){
																			vm.tableBodyArray.push(rowObj);
																			createRowDataWithZeroValue({
																				"methodType" : "Condom",
																				"method" : "Female Condom",
																				"cyp" : 120,
																				"af" : 23.7,
																				"values" : []
																			}).then(function(rowObj){
																				vm.tableBodyArray.push(rowObj);
																				createRowDataWithZeroValue({ 
																					"methodType" : "Other",
																					"method" : "LAM",
																					"cyp" : 4,
																					"af" : 0,
																					"values" : []
																				}).then(function(){
																					vm.tableBodyArray.push(rowObj);
																					createRowDataWithZeroValue({
																						"methodType" : "Other",
																						"method" : "SDM (Standard Days) / Cycle Beads",
																						"cyp" : 1.5,
																						"af" : 74.5,
																						"values" : []
																					}).then(function(rowObj){
																						vm.tableBodyArray.push(rowObj);
																						createRowDataWithZeroValue({
																							"methodType" : "Other",
																							"method" : "Vaginal barrier",
																							"cyp" : 1,
																							"af" : 0,
																							"values" : []
																						}).then(function(rowObj){
																							vm.tableBodyArray.push(rowObj);
																							createRowDataWithZeroValue({
																								"methodType" : "Other",
																								"method" : "Spermicides",
																								"cyp" : 120,
																								"af" : 0,
																								"values" : []
																							}).then(function(rowObj){
																								vm.tableBodyArray.push(rowObj);
																								createRowDataWithZeroValue({
																									"methodType" : "Emergency contraceptions",
																									"method" : "Emergency contraception",
																									"cyp" : 20,
																									"af" : 23.7,
																									"values" : []
																								}).then(function(rowObj){
																									vm.tableBodyArray.push(rowObj);
																								}); // Emergency contraceptions
																							}); // Spermicides 
																						}); // Vaginal barrier
																					}); // SDM (Standard Days) / Cycle Beads
																				}); // LAM
																			}); // Female Condom
																		}); // IND31_C
																	}); // Peri-coital contraception
																}); // IND30_C
															}); // Other Injectable
														}); // Sayana Press
													}); // Lunelle
												}); //Noristerat (NET-En) 
											}); // Depo Provera (DMPA)
										}); // Sino-Implant
							 		}); // IND3_C
							 	}); // Implanon - Implants (1-Rod)
						 	}); // LNG-IUS
 						}); // IND25_C								
 					});	// IND2_C
 				}); // IND1_C
 				
 				
 			} // end of init

 		}// end of inputDataTableController

	} // end of inputDataTable
})();