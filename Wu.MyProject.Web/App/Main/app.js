var appModule = angular.module("appModule", [
    
 "ui.router", "ui.bootstrap", "oc.lazyLoad", "ngSanitize","abp"
    

]);
/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
appModule.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        //cssFilesInsertBefore: 'ng_load_plugins_before', // load the css files before a LINK element with this ID.
        //debug: false,
        //events: true,
        //modules: []
    });
}]);

appModule.config(["$controllerProvider", function ($controllerProvider) {
    $controllerProvider.allowGlobals();
}]);

appModule.config(function ($logProvider) {
    $logProvider.debugEnabled(true);
});

/* Setup global settings */
appModule.factory("settings", ["$rootScope", function ($rootScope) {
    var settings = {
        layout: {
            pageSidebarClosed: false,
            pageContentWhite: true,
            pageBodySolid: false,
            pageAutoScrollOnLoad: 1000
        },
        assetsPath: "/Scripts/assets",
        globalPath: "/Scripts/assets/global",
        layoutPath: "/Scripts/assets/layouts/layout"
    };
   
    return settings;
}]);

//appModule.config([
//    '$stateProvider', '$urlRouterProvider',
//    function ($stateProvider, $urlRouterProvider) {

//        // Default route (overrided below if user has permission)
//        $urlRouterProvider.otherwise("/dashboard");

//        //Welcome page
//        $stateProvider.state('dashboard', {
//            url: '/dashboard',
//            templateUrl: '~/App/Main/views/dashboard/dashboard.cshtml',
//            data: { pageTitle: "信息汇总" },
//            controller: "app.admin.dashboard",
//            resolve: {
//                deps: [
//                    "$ocLazyLoad",
//                    function ($ocLazyLoad) {
//                        return $ocLazyLoad.load({
//                            serie: true,
//                            insertBefore: "#ng_load_plugins_before",
//                            files: [
//                                abp.appPath + "Scripts/assets/global/plugins/morris/morris.css",
//                                abp.appPath + "Scripts/assets/global/plugins/morris/morris.min.js",
//                                abp.appPath + "Scripts/assets/global/plugins/morris/raphael-min.js",
//                                abp.appPath + "Scripts/assets/global/plugins/jquery.sparkline.min.js",
//                                abp.appPath + "Scripts/assets/pages/scripts/dashboard.min.js",
//                                '/App/Main/views/dashboard/dashboard.js?v=' + abp.vtime
//                            ]
//                        });
//                    }
//                ]
//            }
//        });


//        //COMMON routes

//        //if (abp.auth.hasPermission('Pages.Administration.Roles')) {
//        //    $stateProvider.state('roles', {
//        //        url: '/roles',
//        //        templateUrl: '~/App/common/views/roles/index.cshtml',
//        //        menu: 'Administration.Roles'
//        //    });
//        //}

//        //if (abp.auth.hasPermission('Pages.Administration.Users')) {
//        //    $stateProvider.state('users', {
//        //        url: '/users',
//        //        templateUrl: '~/App/common/views/users/index.cshtml',
//        //        menu: 'Administration.Users'
//        //    });
//        //}

//    }
//]);


/* Init global settings and run the app */
appModule.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.settings = settings; // state to be accessed from view


}]);





















//(function () {
//    'use strict';

//    var app = angular.module('app', [
//        'ngAnimate',
//        'ngSanitize',

//        'ui.router',
//        'ui.bootstrap',
//        'ui.jq',

//        'abp'
//    ]);

//    //Configuration for Angular UI routing.
//    app.config([
//        '$stateProvider', '$urlRouterProvider',
//        function ($stateProvider, $urlRouterProvider) {
//            $urlRouterProvider.otherwise('/');

//            if (abp.auth.hasPermission('Pages.Tenants')) {
//                $stateProvider
//                    .state('tenants', {
//                        url: '/tenants',
//                        templateUrl: '/App/Main/views/tenants/index.cshtml',
//                        menu: 'Tenants' //Matches to name of 'Tenants' menu in MyProjectNavigationProvider
//                    });
//                $urlRouterProvider.otherwise('/tenants');
//            }

//            $stateProvider
//                .state('home', {
//                    url: '/',
//                    templateUrl: '/App/Main/views/home/home.cshtml',
//                    menu: 'Home' //Matches to name of 'Home' menu in MyProjectNavigationProvider
//                })
//                .state('about', {
//                    url: '/about',
//                    templateUrl: '/App/Main/views/about/about.cshtml',
//                    menu: 'About' //Matches to name of 'About' menu in MyProjectNavigationProvider
//                });
//        }
//    ]);
//})();