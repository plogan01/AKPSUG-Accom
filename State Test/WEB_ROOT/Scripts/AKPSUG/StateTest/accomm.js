define(['angular', 'components/shared/index'], function (angular) {

    /*Create module. accomApp must match name in html file*/
    var accomApp = angular.module('accomApp', ['powerSchoolModule']);

    //This will create a controller which will be used in our app
    accomApp.controller('accomCont', function ($scope, getService) {
        loadingDialog();
        var grade = $j('#grade').val() * 1;
        if (grade === 5 || grade === 8 || grade === 10) { $scope.science = true; } else { $scope.science = false; }
        if (grade > 2 && grade < 10) { $scope.akStar = true; } else { $scope.akStar = false; }
        if ($j('#elaOverride').val() === 'N') { $scope.elaOverride = true; } else { $scope.elaOverride = false; }
        if ($j('#maOverride').val() === 'N') { $scope.maOverride = true; } else { $scope.maOverride = false; }
        $scope.elaReason = $j('#elaReason').val();
        $scope.maReason = $j('#maReason').val();
       
        
        $scope.warning = '';
        $scope.reasons = [
            { value: "", disp: "" },
            { value: "EMW", disp: "Medical Waiver" },
            { value: "INV", disp: "Invalidation" },
            { value: "PAR", disp: "Parent Refusal" },
            { value: "RMV", disp: "Removal" },
            { value: "STR", disp: "Student Refusal" },
            { value: "UTT", disp: "Absent" }
        ];

        $scope.schools = [];


        getService.getData('/admin/students/statetest/schools.json?').then(function (retData) {
            $scope.schools = retData.data;
            var district = $j('#districtNumber').val();
            var school = $j('#schoolNumber').val();
            if (district) { $scope.testDistrict = setSelect('DistrictID', district); }
            if (school) { $scope.testSchool = setSelect('SchoolID', school); }
            closeLoading();
        });

        $scope.locChange = function () {

            if ($scope.testDistrict.DistrictID > 0) {
                $j('#districtName').val($scope.testDistrict.DistrictName);
                $j('#districtNumber').val($scope.testDistrict.DistrictID);
            } else {
                $scope.testSchool = {};
            }
            if ($scope.testSchool.SchoolID > 0) {
                $j('#schoolName').val($scope.testSchool.SchoolName);
                $j('#schoolNumber').val($scope.testSchool.SchoolID);
            }
            if (!$scope.locationOverride) {
                $j('#schoolName').val('');
                $j('#schoolNumber').val('');
                $j('#districtName').val('');
                $j('#districtNumber').val('');
                $scope.testSchool = {};
                $scope.testDistrict = {};
            }

        };

        $scope.testOverride = function () {

            if ($scope.elaOverride) {
                $j('#elaOverride').val('N');
                if ($scope.elaReason.length < 3) {
                    $scope.warning = 'You must select a reason why the student is not participating in an assessment.';
                } else {
                    $scope.warning = '';
                    $j('#elaReason').val($scope.elaReason);
                }
            } else {
                $j('#elaOverride').val('');
                $scope.elaReason = '';
                $j('#elaReason').val();
            }
            if ($scope.maOverride) {
                $j('#maOverride').val('N');
                if ($scope.maReason.length < 3) {
                    $scope.warning = 'You must select a reason why the student is not participating in an assessment.';
                } else {
                    $scope.warning = '';
                    $j('#maReason').val($scope.maReason);
                }
            } else {
                $j('#maOverride').val('');
                $scope.maReason = '';
                $j('#maReason').val('');
            }
            if (!$scope.elaOverride && !$scope.maOverride) {
                $scope.warning = '';
                $j('#elaReason').val('');
                $j('#maReason').val('');
            }

        };

        function setSelect(query, ID) {
            var result = {};
            for (var i = 0, len = $scope.schools.length; i < len; i++) {
                if ($scope.schools[i][query] === ID) {
                    result = $scope.schools[i];
                    $scope.locationOverride = true;
                    break;
                }
            }
            return result;
        }

    }); //Close controller

    accomApp.factory('getService', function ($http) {
        return {
            getData: function (dataFile) {
                //Return promise directly
                return $http.get(dataFile).then(function (result) {
                    return result.data;
                });
            }
        };
    }); //Close Factory

    accomApp.filter('unique', function () {
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