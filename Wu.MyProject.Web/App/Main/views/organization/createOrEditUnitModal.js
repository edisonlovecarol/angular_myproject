(function () {
    appModule.controller('app.admin.identity.organizations.createOrEditUnitModal', [
        '$scope', '$modalInstance', 'abp.services.app.organizationUnit', 'organizationUnit',
        function ($scope, $modalInstance, organizationUnitService, organizationUnit) {
            var vm = this;

            vm.organizationUnit = organizationUnit;

            vm.saving = false;

            vm.save = function () {
                if (vm.organizationUnit.id) {
                    organizationUnitService
                        .updateOrganizationUnit(vm.organizationUnit)
                        .success(function(result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $modalInstance.close(result);
                        });
                } else {
                    organizationUnitService
                        .createOrganizationUnit(vm.organizationUnit)
                        .success(function(result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $modalInstance.close(result);
                        });
                }
            };

            vm.cancel = function () {
                $modalInstance.dismiss();
            };
        }
    ]);
})();