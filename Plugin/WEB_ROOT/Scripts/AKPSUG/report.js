define(['angular', 'components/shared/index'], function (angular) {
  
	/*Create module. reportApp must match name in html file*/
	var reportApp = angular.module('reportApp', ['powerSchoolModule']);
  
  //This will create a controller which will be used in our app
	reportApp.controller('reportCont', function($scope, getService){

	    
	
		$scope.accomList=[];

		loadingDialog();

		getService.getData('/admin/repoprts/accom.json').then(function(retData){
			retData.pop();
			$scope.accomList = retData;
			closeLoading();
		});
				
		$scope.catSort = '';
		$scope.sortRev = false;
		
	}); //Close controller
  
	reportApp.factory('getService', function($http) {
		return {
			getData: function(dataFile){
				//Return promise directly
				return $http.get(dataFile).then(function(result){
					return result.data;
				});
			}
		};
	}); //Close Factory
    
	reportApp.filter('unique', function () {
	    return function (input, key) {
	        var unique = {};
	        var uniqueList = [];
	        for (var i = 0; i < input.length; i++) {
	            if (typeof unique[input[i][key]] == "undefined") {
	                unique[input[i][key]] = "";
	                uniqueList.push(input[i]);
	            }
	        }
	        return uniqueList;
	    };
	});


}); //Close define