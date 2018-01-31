(function(){
	'use strict';
	angular.module('EMU').directive('outputDataTable',outputDataTable);

	function outputDataTable(){
		return {
			"restrict" : "EA",
			"scope" :{
				"data" : "="
			},			
			"templateUrl" : 'app/main/pages/outputPageDatatable.html',
			"controller" : ["$scope","DTOptionsBuilder",function($scope,DTOptionsBuilder){
				var vm = this;
				vm.dtOptions = DTOptionsBuilder.newOptions()
								//.withDOM("Bfrtip")
								//.withDOM('&lt;"outputtable-header"&gt;pitrfl')
								.withDOM('&lt;"outputtable-header"&gt;Bfrtip')
								.withButtons(['copy','print','csv'])
								.withLanguage({
				 					"oPaginate" : {
				 						"sNext":  "<span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>",
				                		"sPrevious": "<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>"
				 					}
 				});
			}],
			"controllerAs" : "vm"	
		} // end of return block				
	} // end of outputDataTable

})();