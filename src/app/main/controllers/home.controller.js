(function() {
    'use strict';
    angular.module('EMU').controller('HomeController',HomeController);
    
    HomeController.$inject = ["$scope","dhisService","$uibModal"];

    function HomeController($scope,dhisService,$uibModal) {
    	var vm = this;

    	// public methods
    	vm.init = init;
    	vm.openStatesModal = openStatesModal;

    	// private methods
    	var loadDistricts = loadDistricts;
    	var loadStates = loadStates;

    	function init(){
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
			    size : 'lg'
    		});

    		modalInstance.result.then(function(response){
    			console.log(response);
    		},function(response){
    			console.log(response);
    		});
    	} // end of openStatesModal
    }; // end of HomeController
})();
