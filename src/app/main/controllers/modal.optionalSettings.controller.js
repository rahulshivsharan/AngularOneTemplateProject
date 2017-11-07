(function(){
	'use strict';
	angular.module('EMU').controller('ModalOptionalSettingsController',ModalOptionalSettingsController);

	ModalOptionalSettingsController.$inject = ["$scope","$uibModalInstance","_"];

	function ModalOptionalSettingsController($scope,$uibModalInstance,_){
		var vm = this;		

		// public methods
		vm.init = init;
		vm.cancel = cancel;
		vm.addSettings = addSettings;

		// public variables
		vm.themeList = [];
		vm.selectedTheme = "";

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
		}// end of init

		function cancel(){
			$uibModalInstance.dismiss("error");
		}// end of cancel

		function addSettings(){					
			$uibModalInstance.close(vm.selectedTheme);
		}
	} // ModalOptionalSettingsController
})();