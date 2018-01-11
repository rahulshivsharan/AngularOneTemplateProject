(function(){
	'use strict';
	angular.module('EMU').directive('infoBreadCrumb',infoBreadCrumb);

	function infoBreadCrumb(){
		var obj = {};
		obj.restrict = "EA";
		obj.scope = {};
		obj.controller = ["$scope","configParam",function BreadcrumbController($scope,configParam){
			var vm = this;
			vm.selectedStates = undefined;
			vm.selectedDistricts = undefined;
						

			if(angular.isDefined(configParam.selectedDistricts) && angular.isArray(configParam.selectedDistricts) && configParam.selectedDistricts.length > 0){
				
				vm.selectedDistricts = "";

				for(var x = 0; x < configParam.selectedDistricts.length; x++){
					if(x < (configParam.selectedDistricts.length - 1)){
						vm.selectedDistricts += configParam.selectedDistricts[x] + ", "
					}else{
						vm.selectedDistricts += configParam.selectedDistricts[x];
					}	
				}// end of for
			} // end of if

			if(angular.isDefined(configParam.selectedStates) && angular.isArray(configParam.selectedStates) && configParam.selectedStates.length > 0){

				vm.selectedStates = "";

				for(var x = 0; x < configParam.selectedStates.length; x++){
					if(x < (configParam.selectedStates.length - 1)){
						vm.selectedStates += configParam.selectedStates[x] + ", "
					}else{
						vm.selectedStates += configParam.selectedStates[x];
					}	
				}// end of for
			}// end of if
			
		}]; // end of controller

		obj.controllerAs = "vm";
		obj.template = "<ul class='breadcrumb'>" +
						 	"<li>India</li>" +			
						  	"<li ng-if='vm.selectedStates'>{{vm.selectedStates}}</li>" +
						  	"<li ng-if='vm.selectedDistricts'>{{vm.selectedDistricts}}</li>" +						  
						"</ul>";
		return obj;
	}// end of infoBreadCrumb
})();