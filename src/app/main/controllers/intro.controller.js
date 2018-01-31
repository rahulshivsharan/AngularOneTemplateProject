(function(){
	'use strict';
	angular.module("EMU").controller("introController",introController);

	introController.$inject = ["$scope","$state"];

	function introController($scope,$state){		
		var vm = this;

		vm.navigateToHome = navigateToHome;

		function navigateToHome(){			
			$state.go("home");
		} // end of navigateToHome
	} // end of introController
})();