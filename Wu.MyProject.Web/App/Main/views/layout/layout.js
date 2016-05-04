
var appName = "appModule";

angular.module(appName).controller("common.views.layout", ["$scope", function ($scope) {
   
        var layoutLoaded = false;
        $scope.$on("$viewContentLoaded", function () {
            if (layoutLoaded) {
                Layout.fixContentHeight();
            }
            layoutLoaded = true;
        });
   
}
]);



angular.module(appName).controller("common.views.layout.footer", ["$scope", function ($scope) {
    $scope.$on("$includeContentLoaded", function () {
        Layout.initFooter();
    });
}
]);


angular.module(appName).controller("app.views.layout.header", ["$scope", function ($scope) {
    $scope.$on("$includeContentLoaded", function () {
        Layout.initHeader();
    });
}
]);


angular.module(appName).controller("app.admin.layout.themepanel", ["$scope", function ($scope) {
    $scope.$on("$includeContentLoaded", function () {
        Demo.init();
    });
}
]);

angular.module(appName).controller('common.views.layout.sidebar', [
        '$scope',
        function ($scope) {
            var vm = this;

            vm.menu = abp.nav.menus.MainMenu;

            $scope.$on('$includeContentLoaded', function () {
                Layout.initSidebar(); // init sidebar
            });
        }
    ]);
