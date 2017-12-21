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
        	'skin-purple' : { 
                "primary" : '#605ca8', 
                "active" : "#3e3c6b", 
                "gradient" : { 
                    "top" : "#fbfbfb", 
                    "middle" : "#dad9f3", 
                    "bottom" : "#cccbef"  
                } 
            },  
			'skin-purple-light' : { 
                "primary" : '#605ca8', 
                "active" : "#3e3c6b", 
                "gradient" : { 
                    "top" : "#fbfbfb", 
                    "middle" : "#dad9f3", 
                    "bottom" : "#cccbef"  
                } 
            },  
			'skin-blue' : { 
                "primary" : '#3c8dbc', 
                "active" : "#1c577a", 
                "gradient" : { 
                    "top" : "#f3f6f7", 
                    "middle" : "#d0e3ed", 
                    "bottom" : "#c8e4ed"  
                } 
            },  
			'skin-blue-light' : { 
                "primary" : '#3c8dbc',
                "active" : "#1c577a", 
                "gradient" : { 
                    "top" : "#f3f6f7", 
                    "middle" : "#d0e3ed", 
                    "bottom" : "#c8e4ed"  
                } 
            },  
			'skin-yellow' : { 
                "primary" : '#f39c12', 
                "active" : "#bc7300", 
                "gradient" : { 
                    "top" : "#fbfaf7", 
                    "middle" : "#f7eed4", 
                    "bottom" : "#f3e6c1"  
                } 
            }, 
			'skin-yellow-light' : { 
                "primary" : '#f39c12',
                 "active" : "#bc7300", 
                 "gradient" : { 
                    "top" : "#fbfaf7", 
                    "middle" : "#f7eed4", 
                    "bottom" : "#f3e6c1"  
                } 
            },  
			'skin-green' : { 
                "primary" : '#00a65a', 
                "active" : "#036337", 
                "gradient" : { 
                    "top" : "#f3fbf7", 
                    "middle" : "#e4fff1", 
                    "bottom" : "#e2fff2"  
                } 
            }, 
			'skin-green-light' : { 
                "primary" : '#00a65a', 
                "active" : "#036337", 
                "gradient" : { 
                    "top" : "#f3fbf7", 
                    "middle" : "#e4fff1", 
                    "bottom" : "#e2fff2"  
                } 
            },  
			'skin-red' : { 
                "primary" : '#dd4b39', 
                "active" : '#9f1706', 
                "gradient" : { 
                    "top" : "#fff7f6", 
                    "middle" : "#ffebe9", 
                    "bottom" : "#ffdedb"  
                } 
            }, 
			'skin-black' : { 
                "primary" : '#fff', 
                "active" : '#fff', 
                "gradient" : { 
                    "top" : "", 
                    "middle" : "", 
                    "bottom" : ""  
                } 
            } 
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

                configParam.inputChartsColor = themeMap[param.selectedTheme]["primary"];
                less.modifyVars({
					'theme-color' : themeMap[param.selectedTheme]["primary"],
                    'theme-color-active' : themeMap[param.selectedTheme]["active"],
                    'gradient_top' : themeMap[param.selectedTheme]["gradient"]["top"],
                    'gradient_middle' : themeMap[param.selectedTheme]["gradient"]["middle"],
                    'gradient_bottom' : themeMap[param.selectedTheme]["gradient"]["bottom"]
				});

                $scope.$broadcast("SETTINGS_CHANGE",{ "msg" : "Settings Changed" });
            } // end of success

            function error(param){
                console.log(param);
            }
        }// popupSettings

        
    } // HeaderController

    
})();
