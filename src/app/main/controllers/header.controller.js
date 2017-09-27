(function() {
    'use strict';
    angular.module('EMU').controller('HeaderController',HeaderController);
    
    HeaderController.$inject =  ['$scope', 'dhis'];

    function HeaderController($scope, dhis){
        
        $scope.title = "DHIS APPLICATION";

        $scope.goHome = function() {
            window.location = $scope.homeUrl;
        };
    } // HeaderController

    
})();
