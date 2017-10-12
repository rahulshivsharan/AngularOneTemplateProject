(function(){
	'use strict';

	angular.module('EMU').controller('ModalSelectYearsController',ModalSelectYearsController);

	ModalSelectYearsController.$inject = ["$scope","$uibModalInstance","dhisService","_","selected_years","configParam"];

	function ModalSelectYearsController($scope,$uibModalInstance,dhisService,_,selected_years,configParam){
		var vm = this;

		// public methods
		vm.init = init;
		vm.ok = ok;
		vm.cancel = cancel;
		vm.selectYear = selectYear;
		vm.findYear = findYear;

		// public variables
		vm.yearMap = {};
		vm.searchYear = "";

		//private varibles
		var copyOfYearMap = {};

		function findYear(){
			var map = {};
			if(!angular.isDefined(vm.searchYear) || vm.searchYear === null || vm.searchYear === ""){
				angular.forEach(vm.yearMap,function(flag,year){
					copyOfYearMap[year] = flag;
				});
				vm.yearMap = angular.copy(copyOfYearMap);
			}else{
				for(var prop in vm.yearMap){
					if(prop.toLowerCase().includes(vm.searchYear.toLowerCase())){
						map[prop] = vm.yearMap[prop];	
					}
				}
				vm.yearMap = map;				
			}// end of else
		} // end of findYear

		function selectYear(year){
			vm.yearMap[year] = !vm.yearMap[year];
			copyOfYearMap[year] = !copyOfYearMap[year];
		} // end of selectYear

		function init(){
			angular.forEach(configParam.yearList,function(year,index){
				var flag = (_.indexOf(selected_years,year) !== -1) ? true : false;
				vm.yearMap[year] = flag;				
			});

			copyOfYearMap = angular.copy(vm.yearMap);
		} // end of init

		function ok(){
			var selectedYear = _.chain(vm.yearMap).omit(function(flag,yearNo,yearMap){
				return (flag === false);
			}).keys().value();

			$uibModalInstance.close(selectedYear);
		} // end ok

		function cancel(){
			$uibModalInstance.dismiss("cancel");
		} // end cancel

	}// end of ModalSelectYearsController

})();