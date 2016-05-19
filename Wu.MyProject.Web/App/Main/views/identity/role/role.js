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


angular.module(appName).controller('app.admin.identity.roles', [
    'abp.services.app.role', '$scope', "$state", '$modal', function (roleService, $scope, $state, $modal) {
        $scope.title = $state.current.data.pageTitle;

        var vm = this;
        vm.permissions = {
            createPerson: abp.auth.hasPermission('Pages.Administration.Roles.Create'),
            deletePerson: abp.auth.hasPermission('Pages.Administration.Roles.Delete')
        };
        $scope.toolbarTemplate = $("#template").html();

        $scope.createRole = function () {
            openCreateOrEditUserModal(null);


        }
        vm.editRole = function (role) {
            openCreateOrEditUserModal(role.id);
        };

        vm.deleteRole = function (role) {
       


            abp.message.confirm(
                app.localize('RoleDeleteWarningMessage', role.displayName),
                function (isConfirmed) {
                    if (isConfirmed) {
                        roleService.deleteRole({
                            id: role.id
                        }).success(function () {
                            $.osharp.dataSource.read();
                            abp.notify.success(app.localize('SuccessfullyDeleted'));
                        });
                    }
                }
            );
        };

     

        function openCreateOrEditUserModal(roleId) {
            var modalInstance = $modal.open({
                templateUrl: '~/App/Main/views/identity/role/createOrEditModal.cshtml',

                controller: 'common.views.roles.createOrEditModal as vm',
                backdrop: 'static',
                resolve: {
                    roleId: function () {
                        return roleId;
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
                read: "/api/services/app/role/GetRoles",
                create: "/api/services/app/role/CreateOrUpdateRole",
                update: "/api/services/app/role/CreateOrUpdateRole",
                destroy: "/api/services/app/role/DeleteRole"
            },



            model: {
                id: "id",
                fields: {
                    id: { type: "number", editable: false },
                    displayName: { validation: { required: true } },
              
                    creationTime: { type: "date", editable: false }


                }

            },
            columns: [
                //权限判断
                //{ command: [{ template: '<a ng-if="permissions.createPerson" class="k-button" href="\\#" onclick="return toolbar_click()">Command</a>' }], width: 90 },
                { field: "id", title: "编号", width: 75 },
                { field: "displayName", title: "角色名" },
               
                { field: "creationTime", title: "创建时间", format: "{0: yyyy-MM-dd HH:mm}" },
                {

                    command: [{ text: "编辑", className: "btn default btn-xs green", click: function (e) { var tr = $(e.target).closest("tr"); var role = this.dataItem(tr); vm.editRole(role) } },
                              { text: "删除", className: "btn default btn-xs green", click: function (e) { var tr = $(e.target).closest("tr"); var role = this.dataItem(tr); vm.deleteRole(role) } }

                              

                    ],
                    title: "操作", width: "180px"
                }
                    //{ command: [{ name: "edit", template: "<div class='k-button'><span class='k-icon k-edit'></span></div>"}], title: " ", width: 40 },

                    //{ command: [{ name: "destroy", template: "<div class='k-button'><span class='k-icon k-delete'></span></div>" }], title: " ", width: 40 }


                 //{ command: { text: "View", template: kendo.template($("#button-template").html()) }, title: "操作", width: "180px" }


            ],

            dataBound: function (e) {
                //权限判断
                var grid = $("#grid").data("kendoGrid");
                var gridData = grid.dataSource.view();
                for (var i = 0; i < gridData.length; i++) {
                    var currentUid = gridData[i].uid;
                    var currentRow = grid.table.find("tr[data-uid='" + currentUid + "']");
                    if (!vm.permissions.deletePerson) {
                        var deleteButton = $(currentRow).find(".k-grid-删除");
                        deleteButton.hide();

                    }

                }
            },

            editable: {
                mode: "popup",
                //template: kendo.template($("#template").html())
            },

            toolbar: ["create", "save", "cancel"]
        }

        );





    }]);


function toolbar_click() {
    alert("1234");
}



