(function(){	
	'use strict';
	angular.module('EMU').controller('ModalSelectStatesController',ModalSelectStatesController);

	ModalSelectStatesController.$inject = ["$scope","$uibModalInstance","dhisService","_"];

	function ModalSelectStatesController($scope,$uibModalInstance,dhisService,_){
		var vm = this;

		//public methods
		vm.init = init;
		vm.ok = ok;
		vm.cancel = cancel;

		// public variables
		vm.states = [];

		//private methods


		function ok(){
			$uibModalInstance.close("success");
		}

		function cancel(){
			$uibModalInstance.dismiss("cancel");
		}

		function init(){
			console.log(dhisService.statesObject);
			vm.states = _.keys(dhisService.statesObject);
			console.log(vm.states);
		}
	} // end of ModalSelectStatesController

})();