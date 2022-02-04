define(['angular', 'components/shared/index'], function (angular) {

    /*Create module. defaultApp must match name in html file*/
    var defaultApp = angular.module('defaultApp', ['powerSchoolModule']);

    //This will create a controller which will be used in our app
    defaultApp.controller('defaultCont', function ($rootScope, $scope, $compile, getService, postService) {

        $scope.yearid = $j('#yearid').val() * 1;
        $scope.year = $scope.yearid + 1991;

        $scope.codeList = [];

        getService.getData('/admin/district/statetest/testcodes.json').then(function (retData) {
            loadingDialog();
            retData.pop();
            $scope.codeList = retData;
            closeLoading();
        });
        
        $scope.codeSubmit = function (formID) {
            var dataString = $j(formID).serialize();
            postService.postData('/admin/district/statetest/testcodes.json', dataString).then(function (retData) {
                retData.pop();
                $scope.codeList = retData;
                psDialogClose();
            });
        };

        //Open Dialog Control
        $scope.openDialog = function (id, yearid, year) {
            $rootScope.currenturl = '/admin/district/statetest/editpref.html?id=' + id + '&yearid=' + yearid + '&year=' + year;
            var dialogContent = '<div class="dialogContent hide"></div>';
            angular.element('body').append(dialogContent);
            $compile(dialogContent)($scope);
        };  //Close Dialog Control

    }); //Close controller

    defaultApp.directive('dialogContent', function ($rootScope, $compile) {
        return {
            restrict: "C",
            templateUrl: function (element, args) {
                return $rootScope.currenturl + '&rnd=' + Math.floor(Math.random() * Math.pow(2, 32));
            },

            link: function (scope, element, args) {
                psDialog({ content: element.detach().removeClass('hide'), type: "dialogM", docked: "east" });
            }
        }

    }); //Close directive

    defaultApp.factory('getService', function ($http) {
        return {
            getData: function (dataFile) {
                //Return promise directly
                return $http.get(dataFile).then(function (result) {
                    return result.data;
                });
            }
        };
    }); //Close Factory

    defaultApp.factory('postService', function ($http) {
        //return the promise directly
        return {
            postData: function (retUrl, postStr) {
                return $http.post(retUrl, postStr, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (postResult) {
                    return postResult.data;
                });
            }
        };
    }); //Close post factory

    defaultApp.filter('unique', function () {
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