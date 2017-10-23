(function(){
	'use strict';
	angular.module('EMU').directive('infoBreadCrumb',infoBreadCrumb);

	function infoBreadCrumb(){
		var obj = {};
		obj.restrict = "EA";
		obj.scope = {};
		obj.controller = ["$scope","configParam",function BreadcrumbController($scope,configParam){
			var vm = this;

			var selectedOptions = []; //District or States
			vm.options = "";

			if(angular.isDefined(configParam.selectedDistricts) && angular.isArray(configParam.selectedDistricts) && configParam.selectedDistricts.length > 0){
				selectedOptions = configParam.selectedDistricts;
			}else{
				selectedOptions = configParam.selectedStates;
			}

			for(var x = 0; x < selectedOptions.length; x++){
					if(x < (selectedOptions.length - 1)){
						vm.options += selectedOptions[x] + ", "
					}else{
						vm.options += selectedOptions[x];
					}	
			}// end of for
		}]; // end of controller

		obj.controllerAs = "vm";
		obj.template = "<ul class='breadcrumb'>" +
						 	"<li>India</li>" +			
						  	"<li>{{vm.options}}</li>" +						  
						"</ul>";
		return obj;
	}// end of infoBreadCrumb
})();