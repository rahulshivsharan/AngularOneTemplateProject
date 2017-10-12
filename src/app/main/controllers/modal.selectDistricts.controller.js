(function(){
	'use strict';

	angular.module('EMU').controller('ModalSelectDistrictsController',ModalSelectDistrictsController);
	
	ModalSelectDistrictsController.$inject = ["$scope","$uibModalInstance","dhisService","_","selected_districts","configParam"];	

	function ModalSelectDistrictsController($scope,$uibModalInstance,dhisService,_,selected_districts,configParam){
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
			var districtNameArray = _.keys(configParam.districtsObject);

			angular.forEach(districtNameArray,function(district,index){
				var flag = (_.indexOf(selected_districts,district) !== -1) ? true : false;
				vm.districtMap[district] = flag;
			});

			copyOfDistrictMap = angular.copy(vm.districtMap);
		} // end of init

		function ok(){
			
			var selectedDistrict = _.chain(vm.districtMap).omit(function(flag,districtName,districtMap){
				return (flag === false);
			}).keys().value();

			$uibModalInstance.close(selectedDistrict);
		} // end of ok

		function cancel(){
			$uibModalInstance.dismiss("cancel");
		}// end of cancel

	} // ModalSelectDistrictsController
})();