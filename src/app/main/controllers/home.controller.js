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
        vm.isLoading = false;

        // private variables
        var loadedDistricts = undefined;

    	// public methods
    	vm.init = init;
    	vm.openStatesModal = openStatesModal;
        vm.openDistrictModal = openDistrictModal;

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
            loadedDistricts = {};
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

            angular.forEach(promiseArray,function(promiseObject,index){
                $q.when(promiseObject).then(function(response){
                    //console.log("Success ",response["data"]);
                    angular.forEach(response["data"],function(values,districtName){
                        loadedDistricts[districtName] = values;
                    });
                },function(error){
                    console.log("Error ",error.statusText);
                });
            });

            $q.all(promiseArray).then(function(){
                console.log(" District loading Success ");
            },function(){
                console.log(" District loading Failure ");
            }).finally(function(){
                vm.isLoading = false;
                //console.log(" Finally ");
            });

    	} // end of loadDistricts

    	function init(){
            vm.isLoading = true;
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
    			}).finally(function(){
                    vm.isLoading = false;
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
                if(vm.isDistrictSelectionDisabled === false){
                    vm.isLoading = true;
                    loadDistricts();        
                }  
    			 			
    		},function(response){
    			console.log(response);
    		});
    	} // end of openStatesModal

        function openDistrictModal(){
            var modalInstance = $uibModal.open({
                animation : true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/main/pages/modalSelectDistricts.html',
                controller: 'ModalSelectDistrictsController',
                controllerAs: 'vm',
                size : 'lg',
                resolve : {
                    selected_states : function(){
                        return vm.selectedStates
                    }
                }
            });

        }// end of openDistrictModal
    }; // end of HomeController
})();
