(function () {
    /* This is a generic modal that can be used to select an entity.
     * It can work with a remote service method that gets
     * PagedAndFilteredInputDto as input and returns PagedResultOutput<NameValueDto> as output.
     * Example: CommonLookupAppService.FindUsers
     */

    var appName = "appModule";
    angular.module(appName).controller('common.views.common.lookupModal', [
        '$scope', '$modalInstance', 'lookupOptions',
        function ($scope, $modalInstance, lookupOptions) {
            var vm = this;

            vm.loading = false;
            vm.options = angular.extend({
                serviceMethod: null,
                title: app.localize('SelectAnItem'),
                loadOnStartup: true,
                showFilter: true,
                filterText: '',
                skipCount: 0,
                pageSize: app.consts.grid.defaultPageSize,
                callback: function(selectedItem) {
                    //This method is used to get selected item
                }
            }, lookupOptions);

            //检查请求参数
            //Check required parameters
            if (!vm.options.serviceMethod) {
                $modalInstance.dismiss();
                return;
            }
            vm.cancel = function () {
                $modalInstance.dismiss();
            };






            //vm.gridData = [];

            //vm.dataSource = new kendo.data.DataSource({
            //    transport: {
            //        read: {
            //            url: "/api/services/app/organizationUnit/GetOrganizationUnitUsers",
            //            type: "post",
            //            contentType: "application/json; charset=utf-8"
            //        },

            //        dateType: "json",
            //        parameterMap: function (opts, operation) {


            //            if (operation === "read") {



            //                return JSON.stringify({ id: 1 });


            //            }

            //            return {};
            //        }
            //    },

            //    //响应到页面的数据
            //    schema: {
            //        data: function (data) { return data.result == null ? [] : data.result.items; }

            //    }


            //});


            vm.gridData = [];

            vm.dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/api/services/app/commonLookup/FindUsers",
                        type: "post",
                        contentType: "application/json; charset=utf-8"
                    },

                    dateType: "json",
                   
                    parameterMap: function (opts, operation) {


                        if (operation === "read") {

                            var prms = angular.extend({
                                skipCount: vm.options.skipCount,
                                maxResultCount: vm.options.pageSize,
                                filter: vm.options.filterText
                            }, lookupOptions.extraFilters);


                            return JSON.stringify(prms);


                        }

                        return {};
                    }
                },

                //响应到页面的数据
                schema: {
                    data: function (data) { return data.result == null ? [] : data.result.items; }

                }


            });

            vm.gridOptions = {
                dataSource: vm.dataSource,
                pageable: true,
                columns: [
                  {
                   

                      template: function(dataItem) {
                          return '<div class=\"ui-grid-cell-contents\">' +
                              '  <button class="btn btn-default btn-xs" ng-click="vm.selectItem(dataItem)"><i class="fa fa-check"></i> ' + app.localize('Select') + '</button>' +
                              '</div>';
                      },
                      field: "id",
                      title: app.localize('Select'),
                      width: 100
                  },
                  { field: "name", title: "名称" }
                ]
            }


            vm.refreshGrid = function () {
                vm.dataSource.read();
            }
            vm.selectItem=function(item) {
               // alert(row.name);
                var boolOrPromise = vm.options.canSelect(item);
                if (!boolOrPromise) {
                    return;
                }

                if (boolOrPromise === true) {
                    vm.options.callback(item);
                    $modalInstance.close(item);
                    return;
                }

                //assume as promise
                boolOrPromise.then(function (result) {
                    if (result) {
                        vm.options.callback(item);
                        $modalInstance.close(item);
                    }
                });


            }


         
           
        }
    ]);

    //lookupModal service
    angular.module(appName).factory('lookupModal', [
        '$modal',
        function ($modal) {
            function open(lookupOptions) {
                $modal.open({
                    templateUrl: '~/App/Main/common/lookupModal/lookupModal.cshtml',
                    controller: 'common.views.common.lookupModal as vm',
                    backdrop: 'static',
                    resolve: {
                        lookupOptions: function () {
                            return lookupOptions;
                        }
                    }
                });
            }

            return {
                open: open
            };
        }
    ]);
})();