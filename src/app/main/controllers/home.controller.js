(function() {
    'use strict';
    angular.module('EMU').controller('HomeController',HomeController);
    
    HomeController.$inject = ["$scope","dhisService","$uibModal","configParam","$q"];

    function HomeController($scope,dhisService,$uibModal,configParam,$q) {
    	var vm = this;

    	// public variables
    	vm.selectedStates = [];
    	vm.selectedDistricts = [];
    	vm.isDistrictSelectionDisabled = true;

    	// public methods
    	vm.init = init;
    	vm.openStatesModal = openStatesModal;

    	// private methods
    	var loadDistricts = loadDistricts;
    	var loadStates = loadStates;
    	var isDistrictDisabled = isDistrictDisabled;


    	function isDistrictDisabled(){
    		var flag = true;
    		if(angular.isDefined(vm.selectedStates) && angular.isArray(vm.selectedStates) && vm.selectedStates.length > 0){
    			flag = false;		
    		}
    		return flag;
    	}

    	function loadDistricts(){
    		var promiseArray = [];
    		angular.forEach(vm.selectedStates,function(value,index){
    			var stateName = configParam.abbreviation[value.toLowerCase()];
    			var promise = undefined;
    			if(angular.isDefined(stateName) && stateName !== null && stateName !== ""){
    				promise = dhisService.getDistricts(stateName);
    			}else{
    				promise = dhisService.getDistricts(value);
    			}
    			
    			promiseArray.push(promise);
    		});

    		$q.all(promiseArray).then(function(responses){ // success   
    			angular.forEach(responses,function(resp,index){
    				console.log(resp);
    				// resp.then(function(res){
    				// console.log("District Success ",res);	
	    			// },function(error){
	    			// 	console.log("District error ",error);
	    			// });
    			});			
    			
    		});
    	} // end of loadDistricts

    	function init(){
    		vm.selectedStates = dhisService.selectedStates;    		
    		vm.isDistrictSelectionDisabled = isDistrictDisabled();    		
    		loadStates();
    	}

    	// Load all districts
    	function loadStates(){
    		if(!angular.isDefined(dhisService.statesObject)){
    			dhisService.getStates().then(function(response){
    				//console.log(response.data);
    				dhisService.statesObject = response.data;
    			},function(error){
    				console.log(error);
    			});
    		} 
    	} // end of loadStates

    	function openStatesModal(){
    		var modalInstance = $uibModal.open({
    			animation : true,
    			ariaLabelledBy: 'modal-title',
			    ariaDescribedBy: 'modal-body',
			    templateUrl: 'app/main/pages/modalSelectStates.html',
			    controller: 'ModalSelectStatesController',
			    controllerAs: 'vm',
			    size : 'lg',
			    resolve : {
			    	selected_states : function(){
			    		return vm.selectedStates
			    	}
			    }
    		});

    		modalInstance.result.then(function(response){
    			vm.selectedStates = response; 
    			vm.isDistrictSelectionDisabled = isDistrictDisabled();  
    			loadDistricts(); 			
    		},function(response){
    			console.log(response);
    		});
    	} // end of openStatesModal
    }; // end of HomeController
})();
