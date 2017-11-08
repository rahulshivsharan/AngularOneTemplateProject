(function() {
    'use strict';
    angular.module('EMU').controller('HeaderController',HeaderController);
    
    HeaderController.$inject =  ['$scope',"$uibModal","configParam"];

    function HeaderController($scope,$uibModal,configParam){
        var vm = this;
        vm.popupSettings = popupSettings;
        
        vm.theme = "skin-purple"; 

        $scope.title = "EMU";

        var themeMap = {
        	'skin-purple' : '#605ca8',
			'skin-purple-light' : '#605ca8',
			'skin-blue' : '#3c8dbc',
			'skin-blue-light' : '#3c8dbc',
			'skin-yellow' : '#f39c12',
			'skin-yellow-light' : '#f39c12',
			'skin-green' : '#00a65a',
			'skin-green-light' : '#00a65a',
			'skin-red' : '#dd4b39',
			'skin-black' : '#fff'
        };

        $scope.goHome = function() {
            window.location = $scope.homeUrl;
        };

        function popupSettings(){
        	

        	var success = success, error = error;
            var modal = $uibModal.open({
                "animation" : true,
                "ariaLabelledBy" : "modal-title",
                "ariaDescribedBy" : "modal-body",
                "templateUrl" : "app/main/pages/modalOptionalSettings.html",
                "controller" : "ModalOptionalSettingsController",
                "controllerAs" : "vm"
            });

            modal.result.then(success,error);

            function success(param){                
                vm.theme = param;
                configParam.inputChartsColor = themeMap[param];
                less.modifyVars({
					'theme-color' : themeMap[param]
				});
            } // end of success

            function error(param){
                console.log(param);
            }
        }

        
    } // HeaderController

    
})();
