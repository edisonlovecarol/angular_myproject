

var appName = "appModule";
angular.module(appName).controller("app.admin.identity.users", [
    "$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {

        var vm = this;

        vm.title = "这里是用户管理！";
    }
]);
