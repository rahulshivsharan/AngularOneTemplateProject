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
				vm.dtOptions = DTOptionsBuilder.newOptions().withDOM("Bfrtip").withButtons(['copy','print','csv']);
			}],
			"controllerAs" : "vm"	
		} // end of return block				
	} // end of outputDataTable

})();