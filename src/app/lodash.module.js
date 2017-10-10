(function(){
	'use strict';

	angular.module("Lodash",[]);

	angular.module("Lodash").factory("_",["$window",function($window){
		return $window._;
	}]);

	// reference on how to use 'LoDash' with 'Angular' as below,
	// https://stackoverflow.com/questions/23862119/how-to-make-lodash-work-with-angular-js
})();