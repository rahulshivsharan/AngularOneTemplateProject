(function(){
	'use strict';
	angular.module('EMU').controller('ModalSelectSettingsController',ModalSelectSettingsController);

	ModalSelectSettingsController.$inject = ["$scope","$uibModalInstance"];

	function ModalSelectSettingsController($scope,$uibModalInstance){
		var vm = this;		

		// public methods
		vm.init = init;
		vm.cancel = cancel;
		vm.addSettings = addSettings;

		function init(){

		}// end of init

		function cancel(){
			$uibModalInstance.dismiss("error");
		}// end of cancel

		function addSettings(){
			less.modifyVars({
				'theme-color' : vm.colorSettings
			});
			$uibModalInstance.close("success");
		}
	} // ModalSelectSettingsController
})();