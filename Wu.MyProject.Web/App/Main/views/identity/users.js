

var appName = "appModule";
//angular.module(appName).controller("app.admin.identity.users", [
//    "$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {

//        var vm = this;

//        vm.title = "这里是用户管理！";
//    }
//]);



/**
 * Created by gff on 2016/3/21.
 */


angular.module(appName).controller('app.admin.identity.users', [
    'abp.services.app.user', '$scope', "$state", function(userService, $scope, $state) {
        $scope.title = $state.current.data.pageTitle;


        $scope.permissions = {
            createPerson: abp.auth.hasPermission('Pages.Tenant.PhoneBook.CreatePerson'),
            deletePerson: abp.auth.hasPermission('Pages.Tenant.PhoneBook.DeletePerson')
        };



        
       
        
        $scope.gridOptions = $.osharp.kendo.grid.Options({
            url: {
                //read: "/api/services/app/systemDdl/GetSysDdl",
                read: "/api/services/app/user/GetUsers",
                create: "/api/services/app/user/CreateOrUpdateUser",
                update: "/api/services/app/user/CreateOrUpdateUser",
                destroy: "/api/services/app/user/DeleteUser"
            },

            

            model: {
                id: "id",
                fields: {
                    id: { type: "number", editable: false },
                    userName: { validation: { required: true } },
                    surname: { validation: { required: true } },
                    emailAddress: { validation: { required: true } },
                    lastLoginTime: { type: "date", editable: false }

                }
            },
            columns: [
                //权限判断
                { command: [{ template: '<a ng-if="permissions.createPerson" class="k-button" href="\\#" onclick="return toolbar_click()">Command</a>' }], width: 90 },
                { field: "id", title: "编号", width: 75 },
                { field: "userName", title: "用户名" },
                { field: "emailAddress", title: "邮箱地址" },
                { field: "lastLoginTime", title: "最后登录时间", format: "{0: yyyy-MM-dd HH:mm}" }
                
               
            ],
            // editable: "popup"


            toolbar: ["create", "save", "cancel"]
        }

        );


      


    }]);


function toolbar_click() {
    alert("1234");
}




