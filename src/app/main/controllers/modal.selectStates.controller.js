(function(){	
	'use strict';
	angular.module('EMU').controller('ModalSelectStatesController',ModalSelectStatesController);

	ModalSelectStatesController.$inject = ["$scope","$uibModalInstance","dhisService","_","selected_states"];

	function ModalSelectStatesController($scope,$uibModalInstance,dhisService,_,selected_states){
		var vm = this;

		//public methods
		vm.init = init;
		vm.ok = ok;
		vm.cancel = cancel;
		vm.selectState = selectState;
		vm.findStatesByName = findStatesByName;

		// public variables		
		vm.statesMap = {};
		vm.searchState = "";

		// private variables		
		var copyOfStateMap = {};

		//private methods


		function ok(){
			/*
				Picking only those states from stateMap whose 
				flag is true i.e. selected.
			*/
			var selectedStates = _.chain(vm.statesMap).omit(function(flag, stateName, statesMap){
				return 	(flag === false);
			}).keys().value();

			
			$uibModalInstance.close(selectedStates);
		} // end of ok

		function cancel(){
			$uibModalInstance.dismiss("cancel");
		} // end of cancel

		function init(){
			//console.log("Selected States ",selected_states);

			var stateNameArray = _.keys(dhisService.statesObject);
			
			angular.forEach(stateNameArray,function(state,index){
				/*
					Check if are there any pre-selected states, if yes,
					than we need to show those states as highlighted.
				*/
				var flag = (_.indexOf(selected_states,state) !== -1) ? true : false; 
				vm.statesMap[state] = flag;
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