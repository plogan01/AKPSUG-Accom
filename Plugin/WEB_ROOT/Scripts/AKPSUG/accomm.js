define(['angular', 'components/shared/index'], function (angular) {

    /*Create module. peaksApp must match name in html file*/
    var peaksApp = angular.module('peaksApp', ['powerSchoolModule']);

    //This will create a controller which will be used in our app
    peaksApp.controller('peaksCont', function ($scope, getService) {
        
        loadingDialog();

        $scope.dcid = $j('#dcid').html();

        getService.getData('/admin/students/PEAKS/settings.json?dcid=' + $scope.dcid).then(function (retData) {
            retData.pop();          
            $scope.mode = retData[0].testtype;
            $scope.student_number = retData[0].student_number;
            $scope.science = retData[0].science;
            $scope.grade = retData[0].grade;
            closeLoading();
        });
        
        $scope.checkType = function () {

            $j('#testtype').val($scope.mode);
                                  
        };

    }); //Close controller

    
    peaksApp.factory('getService', function ($http) {
        return {
            getData: function (dataFile) {
                //Return promise directly
                return $http.get(dataFile).then(function (result) {
                    return result.data;
                });
            }
        };
    }); //Close Factory

}); //Close define