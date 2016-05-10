

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
                    name: { validation: { required: true } },
                    surname: { validation: { required: true } },
                    emailAddress: { validation: { required: true } },
                    isActive: { type: "boolean" },
                    lastLoginTime: { type: "date", editable: false }
                    

                }
            },
            columns: [
                //权限判断
                { command: [{ template: '<a ng-if="permissions.createPerson" class="k-button" href="\\#" onclick="return toolbar_click()">Command</a>' }], width: 90 },
                { field: "id", title: "编号", width: 75 },
                { field: "name", title: "姓名" },
                { field: "userName", title: "用户名" },
                { field: "emailAddress", title: "邮箱地址" },
                { field: "isActive", title: "是否可用", template: function (d) { return $.osharp.tools.renderBoolean(d.isActive); } },
                { field: "lastLoginTime", title: "最后登录时间", format: "{0: yyyy-MM-dd HH:mm}" }
    
                
               
            ],
             editable: "popup",


            toolbar: ["create", "save", "cancel"]
        }

        );


        $scope.toolbarOptions = {
            items: [
                { type: "button", text: "Button" },
                { type: "button", text: "Toggle Button", togglable: true },
                {
                    type: "splitButton",
                    text: "Insert",
                    menuButtons: [
                        { text: "Insert above", icon: "insert-n" },
                        { text: "Insert between", icon: "insert-m" },
                        { text: "Insert below", icon: "insert-s" }
                    ]
                },
                { type: "separator" },
                { template: "<label>Format:</label>" },
                {
                    template: "<input kendo-drop-down-list k-options='formatOptions' style='width: 150px;' />",
                    overflow: "never"
                },
                { type: "separator" },
                {
                    type: "buttonGroup",
                    buttons: [
                        { spriteCssClass: "k-tool-icon k-justifyLeft", text: "Left", togglable: true, group: "text-align" },
                        { spriteCssClass: "k-tool-icon k-justifyCenter", text: "Center", togglable: true, group: "text-align" },
                        { spriteCssClass: "k-tool-icon k-justifyRight", text: "Right", togglable: true, group: "text-align" }
                    ]
                },
                {
                    type: "buttonGroup",
                    buttons: [
                        { spriteCssClass: "k-tool-icon k-bold", text: "Bold", togglable: true, showText: "overflow" },
                        { spriteCssClass: "k-tool-icon k-italic", text: "Italic", togglable: true, showText: "overflow" },
                        { spriteCssClass: "k-tool-icon k-underline", text: "Underline", togglable: true, showText: "overflow" }
                    ]
                },
                {
                    type: "button",
                    text: "Action",
                    overflow: "always"
                },
                {
                    type: "button",
                    text: "Another Action",
                    overflow: "always"
                },
                {
                    type: "button",
                    text: "Something else here",
                    overflow: "always"
                }
            ]
        };


    }]);


function toolbar_click() {
    alert("1234");
}



