define(['angular', 'components/shared/index'], function (angular) {

    /*Create module. defaultApp must match name in html file*/
    var defaultApp = angular.module('defaultApp', ['powerSchoolModule']);

    //This will create a controller which will be used in our app
    defaultApp.controller('defaultCont', function ($rootScope, $scope, $compile, getService, postService) {
        
        $scope.schoolList = [];

        getService.getData('/admin/district/AKPSUG/schools.json').then(function (retData) {
            loadingDialog();
            retData.pop();
            $scope.schoolList = retData;
            closeLoading();
        });
        
        $scope.accomSubmit = function (formID) {
            var dataString = $j(formID).serialize();
            postService.postData('/admin/district/AKPSUG/schools.json', dataString).then(function (retData) {
                retData.pop();
                $scope.schoolList = retData;
                psDialogClose();
            });
        };

        //Open Dialog Control
        $scope.openDialog = function (id, schoolid, name) {
            $scope.schoolID = schoolid;
            $rootScope.currentID = id;
            $rootScope.currenturl = '/admin/district/akpsug/editaccom.html?id=' + id + '&schoolid=' + schoolid + '&name=' + name;
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