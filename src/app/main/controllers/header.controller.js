(function() {
    'use strict';
    angular.module('EMU').controller('HeaderController',HeaderController);
    
    HeaderController.$inject =  ['$scope', 'dhis'];

    function HeaderController($scope, dhis){
        
        $scope.title = "EMU";

        $scope.goHome = function() {
            window.location = $scope.homeUrl;
        };
    } // HeaderController

    
})();
