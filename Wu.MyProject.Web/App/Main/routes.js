appModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/dashboard");
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: '~/App/Main/views/dashboard/dashboard.cshtml',
        data: { pageTitle: "信息汇总" },
        controller: "app.admin.dashboard",
        resolve: {
            deps: [
                "$ocLazyLoad",
                function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        insertBefore: "#ng_load_plugins_before",
                        files: [
                            staticsUrlPerfix + "/assets/global/plugins/morris/morris.css",
                            staticsUrlPerfix + "/assets/global/plugins/morris/morris.min.js",
                            staticsUrlPerfix + "/assets/global/plugins/morris/raphael-min.js",
                            staticsUrlPerfix + "/assets/global/plugins/jquery.sparkline.min.js",
                            staticsUrlPerfix + "/assets/pages/scripts/dashboard.min.js",
                            '/App/Main/views/dashboard/dashboard.js?v=' + abp.vtime
                        ]
                    });
                }
            ]
        }
    });

    $stateProvider.state('About', {
        url: '/about',
        templateUrl: '/App/Main/views/identity/about.html',
        data: { pageTitle: "关于我们" },
        controller:"app.admin.identity.about",
        menu: 'About',
        resolve: {
            deps: [
                "$ocLazyLoad",
                function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        
                        insertBefore: "#ng_load_plugins_before",
                        files: [
                           
                            '/App/Main/views/identity/about.js'
                        ]
                    });
                }
            ]
        }
    });

}]);