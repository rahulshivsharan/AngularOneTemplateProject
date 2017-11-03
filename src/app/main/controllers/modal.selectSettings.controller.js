(function(){
	'use strict';
	angular.module('EMU').controller('ModalSelectSettingsController',ModalSelectSettingsController);

	ModalSelectSettingsController.$inject = ["$scope"];

	function ModalSelectSettingsController($scope){
		var vm = this;

		// public methods
		vm.init = init;
		vm.cancel = cancel;

		function init(){
			
		}// end of init

		function cancel(){
			
		}// end of cancel
	} // ModalSelectSettingsController
})();