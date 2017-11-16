(function(){
	'use strict';
	angular.module('EMU').directive('outputDataTable',outputDataTable);

	function outputDataTable(){
		return {
			"restrict" : "EA",
			"scope" :{
				"data" : "="
			},			
			"templateUrl" : 'app/main/pages/outputPageDatatable.html'		
		}				
	}

})();