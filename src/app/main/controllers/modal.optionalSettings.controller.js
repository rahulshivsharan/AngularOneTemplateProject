(function(){
	'use strict';
	angular.module('EMU').controller('ModalOptionalSettingsController',ModalOptionalSettingsController);

	ModalOptionalSettingsController.$inject = ["$scope","$uibModalInstance","_","configParam"];

	function ModalOptionalSettingsController($scope,$uibModalInstance,_,configParam){
		var vm = this;		

		// public methods
		vm.init = init;
		vm.cancel = cancel;
		vm.addSettings = addSettings;

		// public variables
		vm.themeList = [];
		vm.selectedTheme = "";
		vm.showGridForGraph = "";
		vm.showAxisForGraph = "";
		vm.showLabelForGraph = "";

		vm.booleanOptions = [{"key" : "Select", "value" : ""} ,{ "key" : "YES", "value" : true },{"key" : "NO", "value" : false}];

		var themeMap = {
        	'skin-purple' : '#605ca8',
			'skin-purple-light' : '#605ca8',
			'skin-blue' : '#3c8dbc',
			'skin-blue-light' : '#3c8dbc',
			'skin-yellow' : '#f39c12',
			'skin-yellow-light' : '#f39c12',
			'skin-green' : '#00a65a',
			'skin-green-light' : '#00a65a',
			'skin-red' : '#dd4b39',
			'skin-black' : '#fff'
        };

		function init(){
			vm.themeList = [
				{ "value" : "", "label" : "Select" },
				{ "value" : "skin-blue", "label" : "Skin-Blue" },
				{ "value" : "skin-blue-light", "label" : "Skin-Blue-Light" },
				{ "value" : "skin-yellow", "label" : "Skin-Yellow" },
				{ "value" : "skin-yellow-light", "label" : "Skin-Yellow-Light" },
				{ "value" : "skin-green", "label" : "Skin-Green" },
				{ "value" : "skin-green-light", "label" : "Skin-Green-Light" },
				{ "value" : "skin-purple", "label" : "Skin-Purple" },
				{ "value" : "skin-purple-light", "label" : "Skin-Purple-Light" },
				{ "value" : "skin-red", "label" : "Skin-Red" },
				{ "value" : "skin-red-light", "label" : "Skin-Red-Light" },
				{ "value" : "skin-black", "label" : "Skin-Black" },
				{ "value" : "skin-black-light", "label" : "Skin-Black-Light" },
			];

			var isThemeAssigned = false;
			angular.forEach(themeMap,function(value,key){				
				if(isThemeAssigned === false && angular.isDefined(configParam.inputChartsColor) && value === configParam.inputChartsColor){
					vm.selectedTheme = key;
					isThemeAssigned = true;	
				}
			});			
			
		}// end of init

		function cancel(){
			$uibModalInstance.dismiss("error");
		}// end of cancel

		function addSettings(){					
			$uibModalInstance.close({
				"selectedTheme" : vm.selectedTheme,	
				"showGridForGraph" : vm.showGridForGraph,
				"showAxisForGraph" : vm.showAxisForGraph,
				"showLabelForGraph" : vm.showLabelForGraph
			});
		}
	} // ModalOptionalSettingsController
})();