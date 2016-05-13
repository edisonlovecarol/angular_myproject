/// <reference path="user/createOrEditModal.cshtml" />
/// <reference path="user/createOrEditModal.cshtml" />


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
    'abp.services.app.user', '$scope', "$state", '$modal', function (userService, $scope, $state, $modal) {
        $scope.title = $state.current.data.pageTitle;

        var vm = this;
        $scope.permissions = {
            createPerson: abp.auth.hasPermission('Pages.Tenant.PhoneBook.CreatePerson'),
            deletePerson: abp.auth.hasPermission('Pages.Tenant.PhoneBook.DeletePerson')
        };
        $scope.toolbarTemplate = $("#template").html();

        $scope.toolbarClick = function() {
            openCreateOrEditUserModal(null);
            

        }
        vm.editUser = function (user) {
            openCreateOrEditUserModal(user.id);
        };

        vm.deleteUser = function (user) {
            if (user.userName == app.consts.userManagement.defaultAdminUserName) {
                abp.message.warn(app.localize("{0}UserCannotBeDeleted", app.consts.userManagement.defaultAdminUserName));
                return;
            }

            abp.message.confirm(
                app.localize('UserDeleteWarningMessage', user.userName),
                function (isConfirmed) {
                    if (isConfirmed) {
                        userService.deleteUser({
                            id: user.id
                        }).success(function () {
                            vm.getUsers();
                            abp.notify.success(app.localize('SuccessfullyDeleted'));
                        });
                    }
                }
            );
        };

        function openCreateOrEditUserModal(userId) {
            var modalInstance = $modal.open({
                templateUrl: '~/App/Main/views/identity/user/createOrEditModal.cshtml',
                
                controller: 'common.views.users.createOrEditModal as vm',
                backdrop: 'static',
                resolve: {
                    userId: function () {
                        return userId;
                    }
                }
            });

            modalInstance.result.then(function (result) {
              //  $.osharp.kendo.grid.Options.dataSource.read();
                $.osharp.dataSource.read();
            });
        }
       
        
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
                    name: { validation: { required: true } },
                    surname: { validation: { required: true } },
                    emailAddress: { validation: { required: true } },
                    isActive: { type: "boolean" },
                    shouldChangePasswordOnNextLogin: { type: "boolean" },
                    lastLoginTime: { type: "date", editable: false }
                    

                }
                
            },
            columns: [
                //权限判断
                //{ command: [{ template: '<a ng-if="permissions.createPerson" class="k-button" href="\\#" onclick="return toolbar_click()">Command</a>' }], width: 90 },
                { field: "id", title: "编号", width: 75 },
                { field: "name", title: "姓名" },
                { field: "userName", title: "用户名" },
                { field: "emailAddress", title: "邮箱地址" },
                { field: "isActive", title: "是否可用", template: function (d) { return $.osharp.tools.renderBoolean(d.isActive); } },
                { field: "shouldChangePasswordOnNextLogin", title: "下次是否重置密码", template: function (d) { return $.osharp.tools.renderBoolean(d.shouldChangePasswordOnNextLogin); }, hidden: true },
                { field: "lastLoginTime", title: "最后登录时间", format: "{0: yyyy-MM-dd HH:mm}" },
                {
                    command: [{ text: "编辑", className: "btn default btn-xs green", click: function (e) { var tr = $(e.target).closest("tr"); var user = this.dataItem(tr); vm.editUser(user) } },
                              { text: "删除", className: "btn default btn-xs green", click: function (e) { var tr = $(e.target).closest("tr"); var user = this.dataItem(tr); vm.deleteUser(user) } }

                    ],
                              title: "操作", width: "180px"
                },
                
                 //{ command: { text: "View", template: kendo.template($("#button-template").html()) }, title: "操作", width: "180px" }
                
               
            ],

            dataBound: function (e) {
                var par = e;
            },
            
             editable: {
                 mode: "popup",
                 template: kendo.template($("#template").html())
             },

            toolbar: ["create", "save", "cancel"]
        }

        );





    }]);


function toolbar_click() {
    alert("1234");
}



