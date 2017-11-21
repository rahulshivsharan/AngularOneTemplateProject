(function() {
    'use strict';
    angular.module('EMU').controller('HeaderController',HeaderController);
    
    HeaderController.$inject =  ['$scope',"$uibModal","configParam","$state"];

    function HeaderController($scope,$uibModal,configParam,$state){
        var vm = this;
        vm.popupSettings = popupSettings; 
        vm.goBack = goBack;       
        vm.theme = "skin-purple"; 

        $scope.title = "EMU";
        $scope.isBackNavigation = false;

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

        function goBack(){
            $scope.isBackNavigation = false;
            var stateName = "";            
            if($state.$current.url.pattern.includes("input")){
                stateName = "home";
            }else if($state.$current.url.pattern.includes("output")){
                stateName = "input";
            }else{
                stateName = "home";
            }
            $state.go(stateName);
        } // goToHome

        $scope.$on("goBack",function(event,data){            
            $scope.isBackNavigation = data;
        });

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
                vm.theme = param["selectedTheme"];
                var showGridForGraph = param["showGridForGraph"];

                var options = {};
                options.yAxis = {};
                options.xAxis = {};
                options.yAxis.labels = {}
                options.xAxis.labels = {}

                if(param["showAxisForGraph"] === false){
                    options.yAxis.visible = false;
                    options.xAxis.visible = false;
                }else{
                    options.yAxis.visible = true;
                    options.yAxis.visible = true;
                }
                
                if(param["showLabelForGraph"] === false){
                    options.yAxis.labels.enabled = false;
                    options.xAxis.labels.enabled = false;
                }else{
                    options.yAxis.labels.enabled = true;
                    options.xAxis.labels.enabled = true;
                }
                
                //options.legend = {};
                //options.legend.enabled = false;

                if(showGridForGraph === true){
                    options.yAxis.gridLineWidth = 1;
                    options.yAxis.minorGridLineWidth = 1;
                }else{
                    options.yAxis.gridLineWidth = 0;
                    options.yAxis.minorGridLineWidth = 0;
                }
                Highcharts.setOptions(options);

                configParam.inputChartsColor = themeMap[param.selectedTheme];
                less.modifyVars({
					'theme-color' : themeMap[param.selectedTheme]
				});

                $scope.$broadcast("SETTINGS_CHANGE",{ "msg" : "Settings Changed" });
            } // end of success

            function error(param){
                console.log(param);
            }
        }// popupSettings

        
    } // HeaderController

    
})();
