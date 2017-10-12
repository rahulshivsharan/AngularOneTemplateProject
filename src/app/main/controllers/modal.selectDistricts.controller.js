(function(){
	'use strict';

	angular.module('EMU').controller('ModalSelectDistrictsController',ModalSelectDistrictsController);
	
	ModalSelectDistrictsController.$inject = ["$scope","$uibModalInstance","dhisService","_","selected_districts"];	

	function ModalSelectDistrictsController($scope,$uibModalInstance,dhisService,_,selected_districts){
		var vm = this;

		// public methods
		vm.init = init;
		vm.ok = ok;
		vm.cancel = cancel;
		vm.selectDistrict = selectDistrict;

		// public variables
		vm.searchDistrict = "";
		vm.districtMap = {};

		// private variables
		var copyOfDistrictMap = {};


		function selectDistrict(districtName){
			vm.districtMap[districtName] = !vm.districtMap[districtName];
			copyOfDistrictMap[districtName] = !copyOfDistrictMap[districtName];
		} // selectDistrict

		function init(){
			var districtNameArray = _.keys(dhisService.districtsObject);

			angular.forEach(districtNameArray,function(district,index){
				var flag = (_.indexOf(selected_districts,district) !== -1) ? true : false;
				vm.districtMap[district] = flag;
			});

			copyOfDistrictMap = angular.copy(vm.districtMap);
		} // end of init

		function ok(){
			
			var selectDistrict = _.chain(vm.districtMap).omit(function(flag,districtName,districtMap){
				return (flag === false);
			}).keys().value();

			$uibModalInstance.close(selectDistrict);
		} // end of ok

		function cancel(){
			$uibModalInstance.dismiss("cancel");
		}// end of cancel

	} // ModalSelectDistrictsController
})();