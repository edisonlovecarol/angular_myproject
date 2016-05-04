

var appName = "appModule";
angular.module(appName).controller("app.admin.identity.about", [
    "$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {
        
        var vm = this;

       vm.title = "欢迎您的到来！";
    }
]);
