(function(){
	'use strict';

	angular.module("EMU").directive("outputtableHeader",outputtableHeader);
	angular.module("EMU").directive("datatableWrapper",datatableWrapper);
	datatableWrapper.$inject = ["$compile","$timeout"];

	function outputtableHeader(){
		return {
			"restrict" : "C",
			"template" : "<h3>EMU Output Table</h3>"
		}
	} // end of outputTableHeader

	function datatableWrapper($compile,$timeout){
		return {
			"restrict" : "E",
			"transclude" : true,
			"template" : "<ng-transclude></ng-transclude>",
			"link" : function(scope,element){
				$timeout(function(){
					$compile(element.find(".outputtable-header"))(scope);
				},0,false);
			}
		}
	} // end of datatableWrapper
})();