define(['angular', 'components/shared/index'], function (angular) {

    /*Create module. adminApp must match name in html file*/
    var peaksApp = angular.module('peaksApp', ['powerSchoolModule']);

    //This will create a controller which will be used in our app
    peaksApp.controller('peaksCont', function ($rootScope, $scope, getService) {

        loadingDialog();

        $scope.teacherList = [];

        getService.getData('/admin/lep/scripts/teachers.json').then(function (retData) {
            retData.pop();
            $scope.teacherList = retData;
        });
        
        closeLoading();

        $scope.catSort = '';
        $scope.sortRev = false;
        $scope.clearFilters = function () {
            $scope.catSearch = {};
        };

        $scope.sort = '';
        $scope.sortReverse = false;
        $scope.clearFilter = function () {
            $scope.search = {};
        };

        $scope.gender = true;
        $scope.status = true;
        $scope.grade = true;
        $scope.race = true;
        $scope.language = true;
        $scope.language2 = true;
        $scope.homelanguage = true;
        $scope.school = false;
        $scope.elap_teacher = false;
        $scope.homeroom = false;

        $scope.side = { 'active': '0' };

        $scope.teacherSubmit = function (formID) {
            var dataString = $j(formID).serialize();
            postService.postData('/admin/lep/scripts/teachers.json', dataString).then(function (retData) {
                retData.pop();
                $scope.teacherList = retData;
                psDialogClose();
            });
        };

        $scope.serviceSubmit = function (formID) {
            var dataString = $j(formID).serialize();
            postService.postData('/admin/lep/scripts/services.json', dataString).then(function (retData) {
                retData.pop();
                $scope.serviceList = retData;
                psDialogClose();
            });
        };

        $scope.catSubmit = function (formID) {
            var dataString = $j(formID).serialize();
            postService.postData('/admin/lep/scripts/cats.json', dataString).then(function (retData) {
                retData.pop();
                $scope.catList = retData;
                psDialogClose();
            });
        };

        $scope.accomSubmit = function (formID) {
            var dataString = $j(formID).serialize();
            postService.postData('/admin/lep/scripts/accom.json', dataString).then(function (retData) {
                retData.pop();
                $scope.accomList = retData;
                psDialogClose();
            });
        };

        //Open Dialog Control
        $scope.openDialog = function (id, url) {
            $rootScope.currentID = id;
            $rootScope.currenturl = url;
            var dialogContent = '<div class="dialogContent hide"></div>';
            angular.element('body').append(dialogContent);
            $compile(dialogContent)($scope);
        };  //Close Dialog Control

    }); //Close controller

    adminApp.directive('dialogContent', function ($rootScope, $compile) {
        return {
            restrict: "C",
            templateUrl: function (element, args) {
                return $rootScope.currenturl + "?id=" + $rootScope.currentID + '&rnd=' + Math.floor(Math.random() * Math.pow(2, 32));
            },

            link: function (scope, element, args) {
                psDialog({ content: element.detach().removeClass('hide'), type: "dialogM", docked: "east" });
            }
        }

    }); //Close directive

    adminApp.factory('getService', function ($http) {
        return {
            getData: function (dataFile) {
                //Return promise directly
                return $http.get(dataFile).then(function (result) {
                    return result.data;
                });
            }
        };
    }); //Close Factory

    adminApp.factory('postService', function ($http) {
        //return the promise directly
        return {
            postData: function (retUrl, postStr) {
                return $http.post(retUrl, postStr, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (postResult) {
                    return postResult.data;
                });
            }
        };
    }); //Close post factory

    adminApp.filter('unique', function () {
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