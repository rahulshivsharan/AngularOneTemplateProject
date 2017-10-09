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
		vm.selectState = selectState;
		vm.findStatesByName = findStatesByName;

		// public variables
		vm.states = [];
		vm.statesMap = {};
		vm.searchState = "";

		// private variables		
		var copyOfStateMap = {};

		//private methods


		function ok(){
			$uibModalInstance.close("success");
		}

		function cancel(){
			$uibModalInstance.dismiss("cancel");
		}

		function init(){
			//console.log(dhisService.statesObject);
			var stateNameArray = _.keys(dhisService.statesObject);
			
			angular.forEach(stateNameArray,function(state,index){
				vm.statesMap[state] = false;
			});	

			copyOfStateMap = angular.copy(vm.statesMap);
		} // end of init

		function selectState(stateName){
			vm.statesMap[stateName] = !vm.statesMap[stateName];
			copyOfStateMap[stateName] = !copyOfStateMap[stateName]; 			
		}// end of selectState


		function findStatesByName(){			
			var map = {};
			if(!angular.isDefined(vm.searchState) || vm.searchState === null || vm.searchState === ""){
				angular.forEach(vm.statesMap,function(flag,stateName){
					copyOfStateMap[stateName] = flag;
				});
				vm.statesMap = angular.copy(copyOfStateMap);
			}else{
				for(var prop in vm.statesMap){
					if(prop.toLowerCase().includes(vm.searchState.toLowerCase())){
						map[prop] = vm.statesMap[prop];	
					}
				}
				vm.statesMap = map;				
			}// end of else
		}// end of findStatesByName

	} // end of ModalSelectStatesController

})();