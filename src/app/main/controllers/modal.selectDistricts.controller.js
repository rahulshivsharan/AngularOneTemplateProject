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
		vm.findDistrictByName = findDistrictByName;

		// public variables
		vm.searchDistrict = "";
		vm.districtMap = {};

		// private variables
		var copyOfDistrictMap = {};

		function findDistrictByName(){
			var map = {};
			if(!angular.isDefined(vm.searchDistrict) || vm.searchDistrict === null || vm.searchDistrict === ""){
				angular.forEach(vm.districtMap,function(flag,districtName){
					copyOfDistrictMap[districtName] = flag;
				});
				vm.districtMap = angular.copy(copyOfDistrictMap);
			}else{
				for(var prop in vm.districtMap){
					if(prop.toLowerCase().includes(vm.searchDistrict.toLowerCase())){
						map[prop] = vm.districtMap[prop];	
					}
				}
				vm.districtMap = map;
			} // end of else
			
		} // end of findDistrictByName

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