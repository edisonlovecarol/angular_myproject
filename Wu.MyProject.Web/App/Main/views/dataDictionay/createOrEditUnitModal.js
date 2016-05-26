(function () {
    appModule.controller('app.admin.identity.dataDictionay.createOrEditUnitModal', [
        '$scope', '$modalInstance', 'abp.services.app.dataDictionay', 'dataDictionay',
        function ($scope, $modalInstance, dataDictionayService, dataDictionay) {
            var vm = this;

            vm.dataDictionay = dataDictionay;

            vm.saving = false;

            vm.save = function () {
                if (vm.dataDictionay.id) {
                    dataDictionayService
                        .updateDataDictionry(vm.dataDictionay)
                        .success(function(result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $modalInstance.close(result);
                        });
                } else {
                    dataDictionayService
                        .createDataDictionry(vm.dataDictionay)
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