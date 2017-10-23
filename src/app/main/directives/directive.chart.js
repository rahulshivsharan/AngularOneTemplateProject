(function(){
	'use strict';
	angular.module('EMU').directive('highChartRender',highChartRender);

	function highChartRender(){
		return {
			"restrict" : "E",
			"template" : "<div></div>",
			"scope" : {
				"options" : "="
			},
			"link" : function(scope,element){				
				Highcharts.chart(element[0],scope.options);
			}
		}
	}// end of highChartRender
})();