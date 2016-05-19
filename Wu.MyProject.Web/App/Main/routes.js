var kendofiles = [
     "/Scripts/assets/global/plugins/kendoui/kendo.common.min.css",
     //"/Scripts/assets/global/plugins/kendoui/kendo.office365.min.css",
      "/Scripts/assets/global/plugins/kendoui/kendo.bootstrap.min.css",
     "/Scripts/assets/global/plugins/kendoui/kendo.all.min.js",
     "/Scripts/assets/global/plugins/kendoui/kendo.web.min.js",
     "/Scripts/assets/global/plugins/kendoui/cultures/kendo.messages.zh-CN.min.js",
     "/Scripts/assets/global/plugins/kendoui/cultures/kendo.culture.zh-CN.min.js"
];



appModule.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/dashboard");
    $stateProvider.state('HomePage', {
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
     //用户管理
    if (abp.auth.hasPermission('Pages.Administration.Users')) {
        $stateProvider.state('users', {
            url: '/users',
            templateUrl: '/App/Main/views/identity/users.html',
            data: { pageTitle: "用户信息" },
            controller: "app.admin.identity.users",
            menu: 'Administration.Users',
            resolve: {
                deps: [
                    "$ocLazyLoad",
                    function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: "#ng_load_plugins_before",


                            files: kendofiles
                                .concat([
                                    '/App/Main/views/identity/users.js',
                                    '/App/Main/views/identity/user/createOrEditModal.js',
                                    '/App/Main/views/identity/user/permissionsModal.js'
                                    //'/App/Main/views/identity/user/createOrEditModal.cshtml'
                                ])
                        });
                    }
                ]
            }
        });
    }
    //角色管理
    if (abp.auth.hasPermission('Pages.Administration.Roles')) {
        $stateProvider.state('roles', {
            url: '/roles',
            templateUrl: '/App/Main/views/identity/role/role.html',
            data: { pageTitle: "角色信息" },
            controller: "app.admin.identity.roles",
            menu: 'Administration.Roles',
            resolve: {
                deps: [
                    "$ocLazyLoad",
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: "#ng_load_plugins_before",


                            files: kendofiles
                                .concat([
                                    '/App/Main/views/identity/role/role.js',
                                    '/App/Main/views/identity/role/createOrEditModal.js'
                                   
                                    //'/App/Main/views/identity/user/createOrEditModal.cshtml'
                                ])
                        });
                    }
                ]
            }
        });
    }


}]);