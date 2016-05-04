//appModule.controller("app.admin.dashboard", function ($scope, $rootScope, $http, $timeout) {
//    $scope.$on("$viewContentLoaded", function () {
//        App.initAjax();
//    });
//    // set sidebar closed and body solid layout mode
//    $rootScope.settings.layout.pageContentWhite = true;
//    $rootScope.settings.layout.pageBodySolid = false;
//    $rootScope.settings.layout.pageSidebarClosed = false;
//});







    //var controllerId = 'app.admin.dashboard';
    //appModule.controller(controllerId, [
    //    '$rootScope', '$state',
    //    function ($scope, $rootScope) {
    //        $scope.$on("$viewContentLoaded", function () {
    //            App.initAjax();
    //        });
    //        // set sidebar closed and body solid layout mode
    //        //$rootScope.settings.layout.pageContentWhite = true;
    //        //$rootScope.settings.layout.pageBodySolid = false;
    //        //$rootScope.settings.layout.pageSidebarClosed = false;

    //    }
    //]);
    appModule.controller("app.admin.dashboard", function ($scope, $rootScope, $http, $timeout) {
        $scope.$on("$viewContentLoaded", function () {
            App.initAjax();
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });