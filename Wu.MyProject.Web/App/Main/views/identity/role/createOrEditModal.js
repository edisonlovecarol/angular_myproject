(function () {
    appModule.controller('common.views.roles.createOrEditModal', [
        '$scope', '$modalInstance', 'abp.services.app.role', 'roleId',
        function ($scope, $modalInstance, roleService, roleId) {
            var vm = this;

            vm.saving = false;
            vm.role = null;
            vm.permissionEditData = null;

            vm.save = function () {
                vm.saving = true;
                roleService.createOrUpdateRole({
                    role: vm.role,
                    grantedPermissionNames: vm.permissionEditData.grantedPermissionNames
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $modalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $modalInstance.dismiss();
            };
            function init() {
                roleService.getRoleForEdit({
                    id: roleId
                }).success(function (result) {
                    vm.role = result.role;
                    vm.permissionEditData = {
                        permissions: result.permissions,
                        grantedPermissionNames: result.grantedPermissionNames
                    };
                });
            }

            init();

        }
    ]);
})();