(function(){
	'use strict';
	angular.module('EMU').directive('outputDataTable',outputDataTable);

	outputDataTable.$inject = ["DTOptionsBuilder"];

	function outputDataTable(DTOptionsBuilder){
		return {
			"restrict" : "EA",
			"scope" :{
				"data" : "="
			},			
			"templateUrl" : 'app/main/pages/outputPageDatatable.html',
			"link" : function(scope){
				scope.dtOptions = DTOptionsBuilder.newOptions().withDOM("Bfrtip").withButtons(['copy','print','csv']);
				console.log("dtOptions ",scope.dtOptions);

				/*
				scope.dtOptions.withOption("buttons",[
    					'copy',
    					 {
	    					"extend": 'csv',
	    					"action": function(e, dt, button, config) {
	    						config.filename = "EMUOutput";
	    						$.fn.dataTable.ext.buttons.csvHtml5.action(e, dt, button, config);
	    					}
    					},
    					{
    					  "extend": 'excel',
    					   "action": function(e, dt, button, config) {
	    						config.filename = "EMUOutput";
	    						$.fn.dataTable.ext.buttons.csvHtml5.action(e, dt, button, config);
    					  }
    					}
    			]);*/



				/*
				scope.dtOptions.withButtons([
					'copy',
					'print', 
					'excel'					
				]);*/
				
				/*
				scope.dtOptions = {
					withTableToolsButtons : {

					}
					dom: 'Bfrtip',
					buttons: [
    					'copy',
    					 {
	    					"extend": 'csv',
	    					"action": function(e, dt, button, config) {
	    						config.filename = "EMUOutput";
	    						$.fn.dataTable.ext.buttons.csvHtml5.action(e, dt, button, config);
	    					}
    					},
    					{
    					  "extend": 'excel',
    					   "action": function(e, dt, button, config) {
	    						config.filename = "EMUOutput";
	    						$.fn.dataTable.ext.buttons.csvHtml5.action(e, dt, button, config);
    					  }
    					}
    				]
				}*/ // end of dtOptions
			} // end of link		
		} // end of return block				
	} // end of outputDataTable

})();