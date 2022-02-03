define(['angular', 'components/shared/index'], function (angular) {
  
	/*Create module. reportApp must match name in html file*/
	var reportApp = angular.module('reportApp', ['powerSchoolModule']);
  
  //This will create a controller which will be used in our app
	reportApp.controller('reportCont', function($scope, getService){
		$scope.schoolID = $j('#schoolid').val();
		$scope.accomList=[];

		loadingDialog();

		getService.getData('/admin/reports/statetest/accom.json').then(function(retData){
			retData.pop();
			$scope.accomList = retData;
			closeLoading();
		});
				
		$scope.sort = '';
		$scope.sortRev = false;
		
	}); //Close controller

	reportApp.directive('exportToCsv',function(){
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
			var el = element[0];
			element.bind('click', function(e){
				var table = e.target.nextElementSibling;
				var csvString = '';
				for(var i=0; i<table.rows.length;i++){
					var rowData = table.rows[i].cells;
					for(var j=0; j<rowData.length;j++){
						t = rowData[j].innerText;
						t = t.replace(/\s+/g, ' ').trim();
						csvString = csvString + '"' + t + '",';
					}
					csvString = csvString.substring(0,csvString.length - 1);
					csvString = csvString + "\n";
				}
				csvString = csvString.substring(0, csvString.length - 1);
				var a = $j('<a/>', {
					style:'display:none',
					href:'data:application/octet-stream;base64,'+btoa(csvString),
					download:'Accommodations.csv'
				}).appendTo('body')
				a[0].click()
				a.remove();
			});
			}
		}
	});
  
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