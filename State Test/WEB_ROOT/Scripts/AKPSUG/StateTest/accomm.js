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
        if ($j('#scOverride').val() === 'N') { $scope.scOverride = true; } else { $scope.scOverride = false; }
        $scope.elaReason = $j('#elaReason').val();
        $scope.maReason = $j('#maReason').val();
        $scope.scReason = $j('#scReason').val();
        $scope.gradeAlert = '';
       
        
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

        $scope.scReasons = [
            { value: "", disp: "" },
            { value: "MED", disp: "Medical Waiver" },
            { value: "INV", disp: "Invalidation" },
            { value: "PRF", disp: "Parent Refusal" },
            { value: "ABS", disp: "Absent" },
            { value: "SRF", disp: "Student Refusal" },
            { value: "NOA", disp: "Not Attempted" },
            { value: "TRN", disp: "Student Transfer" }
        ];

        $scope.schools = [];

        getService.getData('/admin/students/statetest/json/testPref.json?').then(function (retData) {
            var pref = retData[0].override;
            if (pref && pref === '1') {
                if (!$scope.science || !$scope.akStar) {
                    $scope.science = true;
                    $scope.akStar = true;
                    $scope.gradeAlert = 'This student is not currently eligible for some (or all) state tests. Test Accommodations are available due to a District Override setting.';
                }
            }
        });

        getService.getData('/admin/students/statetest/json/schools.json?').then(function (retData) {
            $scope.schools = retData.data;
            var district = $j('#districtNumber').val();
            var school = $j('#schoolNumber').val();
            if (district) { $scope.testDistrict = setSelect('DistrictID', district); }
            if (school) { $scope.testSchool = setSelect('SchoolID', school); }
            closeLoading();
        });

        $scope.locChange = function () {

            if (typeof $scope.testDistrict !== 'undefined' && $scope.testDistrict.DistrictID > 0) {
                $j('#districtName').val($scope.testDistrict.DistrictName);
                $j('#districtNumber').val($scope.testDistrict.DistrictID);
            } else {
                $scope.testSchool = {};
            }
            if (typeof $scope.testSchool !== 'undefined' && $scope.testSchool.SchoolID > 0) {
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

        $scope.elaTestOverride = function (test, val) {

            if (test) {
                $j('#elaOverride').val('N');
                if (val.length < 3) {
                    $scope.warning = 'You must select a reason why the student is not participating in the ELA an assessment.';
                } else {
                    $scope.warning = '';
                    $j('#elaReason').val(val);
                }
            } else {
                $scope.warning = '';
                $j('#elaOverride').val('');
                $scope.elaReason = '';
                $j('#elaReason').val();
            }
        };

        $scope.maTestOverride = function (test, val) {
            if (test) {
                $j('#maOverride').val('N');
                if (val.length < 3) {
                    $scope.warning = 'You must select a reason why the student is not participating in the Math assessment.';
                } else {
                    $scope.warning = '';
                    $j('#maReason').val(val);
                }
            } else {
                $scope.warning = '';
                $j('#maOverride').val('');
                $scope.maReason = '';
                $j('#maReason').val('');
            }
        };

        $scope.scTestOverride = function (test, val) {
            if (test) {
                $j('#scOverride').val('N');
                if (val.length < 3) {
                    $scope.scWarning = 'You must select a reason why the student is not participating in the Science Assessment.';
                } else {
                    $scope.scWarning = '';
                    $j('#scReason').val(val);
                }
            } else {
                $scope.scWarning = '';
                $j('#scOverride').val('');
                $scope.scReason = '';
                $j('#scReason').val('');
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