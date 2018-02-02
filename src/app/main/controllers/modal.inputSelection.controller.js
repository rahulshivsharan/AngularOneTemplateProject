(function() {
    'use strict';
    angular.module('EMU').controller('modalInputSelectionController',modalInputSelectionController);
    
    HomeController.$inject = ["$scope","dhisService","$uibModal","configParam","$q","utilityService","$state","$uibModalInstance"];

    function modalInputSelectionController($scope,dhisService,$uibModal,configParam,$q,utilityService,$state,$uibModalInstance) {
    	var vm = this;

    	// public variables
    	vm.selectedStates = [];
    	vm.selectedDistricts = [];
        vm.selectedYears = [];
    	vm.isDistrictSelectionDisabled = true;
        vm.isLoading = false;
        vm.isNational = false;

        // private variables
        var loadedDistricts = undefined;

    	// public methods
    	vm.init = init;
    	vm.openStatesModal = openStatesModal;
        vm.openDistrictModal = openDistrictModal;
        vm.openYearSelectionModal = openYearSelectionModal;
        vm.extractData = extractData;
        vm.cancel = cancel;        

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

        function extractData(){            
            configParam.isNationalSelected = vm.isNational;
            // configParam.processedData = utilityService.processData();

            // // data processing for graphs and charts,
            // console.log(configParam.processedData);

            // var data = utilityService.processDataForCharts();

            // console.log(data);

            $uibModalInstance.close({
                "flag": "success"
            });            
        } // end of extractData

        // fetch districts on the basis of selected states
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
                configParam.districtsObject = loadedDistricts;
                //console.log(" Finally ");
            });

    	} // end of loadDistricts

    	function init(){
            vm.isLoading = true;            
    		vm.selectedStates = configParam.selectedStates;  
            vm.selectedYears =  configParam.selectedYears;  
            vm.isNational = configParam.isNationalSelected;		
    		vm.isDistrictSelectionDisabled = isDistrictDisabled();    		
    		loadStates();
    	} // end init

    	// Load all districts
    	function loadStates(){
    		if(!angular.isDefined(configParam.statesObject)){
    			dhisService.getStates().then(function(response){
    				//console.log(response.data);
    				configParam.statesObject = response.data;
    			},function(error){
    				console.log(error);
    			}).finally(function(){
                    vm.isLoading = false;
                });
    		}else{
                vm.isLoading = false;                
            } 
    	} // end of loadStates

        // open state selection modal
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
                configParam.selectedStates = response; 
    			vm.isDistrictSelectionDisabled = isDistrictDisabled();
                if(vm.isDistrictSelectionDisabled === false){
                    vm.isLoading = true;
                    loadDistricts();        
                }  
    			 			
    		},function(response){
    			console.log(response);
    		});
    	} // end of openStatesModal

        // open district selection modal 
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
                    selected_districts : function(){
                        return vm.selectedDistricts
                    }
                }
            });

            modalInstance.result.then(function(response){
                vm.selectedDistricts = response;
                configParam.selectedDistricts = response;                 
            },function(response){
                console.log(response);
            });
        }// end of openDistrictModal

        function openYearSelectionModal(){
            var modalInstance = $uibModal.open({
                animation : true,
                ariaLabelledBy : "modal-title",
                ariaDescribedBy : "modal-body",
                templateUrl : "app/main/pages/modalSelectYears.html",
                controller: 'ModalSelectYearsController',
                controllerAs: 'vm',
                size : 'lg',
                 resolve : {
                    selected_years : function(){
                        return vm.selectedYears
                    }
                }
            });

            modalInstance.result.then(function(response){
                vm.selectedYears = response;
                configParam.selectedYears = response;                 
            },function(response){
                console.log(response);
            });
        } // openYearSelectionModal


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

    }; // modalInputSelectionController
})();
