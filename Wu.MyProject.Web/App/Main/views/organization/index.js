(function () {
var appName = "appModule";

/**
 * Created by gff on 2016/3/21.
 */
angular.module(appName).controller('app.admin.identity.organizations', [
    'abp.services.app.organizationUnit', '$scope', "$state", '$modal', '$q', 'abp.services.app.commonLookup', 'lookupModal', function (organizationUnitService, $scope, $state, $modal, $q,commonLookupService, lookupModal) {
        $scope.title = $state.current.data.pageTitle;

        var vm = this;
        vm.dataSource = {};
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });

        vm.permissions = {
            //manageOrganizationTree: true,
            //manageMembers: true
            manageOrganizationTree: abp.auth.hasPermission('Pages.Administration.OrganizationUnits.ManageOrganizationTree'),
            manageMembers: abp.auth.hasPermission('Pages.Administration.OrganizationUnits.ManageMembers')
        };
       
        
        vm.organizationTree = {

            $tree: null,

            unitCount: 0,

            setUnitCount: function (unitCount) {
              
                    vm.organizationTree.unitCount = unitCount;
                
            },

            refreshUnitCount: function () {
                vm.organizationTree.setUnitCount(vm.organizationTree.$tree.jstree('get_json').length);
            },

            selectedOu: {
                id: null,
                displayName: null,
                code: null,

                set: function (ouInTree) {
                    if (!ouInTree) {
                        vm.organizationTree.selectedOu.id = null;
                        vm.organizationTree.selectedOu.displayName = null;
                        vm.organizationTree.selectedOu.code = null;
                    } else {
                        vm.organizationTree.selectedOu.id = ouInTree.id;
                        vm.organizationTree.selectedOu.displayName = ouInTree.original.displayName;
                        vm.organizationTree.selectedOu.code = ouInTree.original.code;
                    }
                   
                    // vm.members.load();

                    vm.dataSource.read();
                }
            },

            contextMenu: function (node) {

                var items = {
                    editUnit: {
                        label: app.localize('Edit'),
                        _disabled: !vm.permissions.manageOrganizationTree,
                        action: function (data) {
                            var instance = $.jstree.reference(data.reference);

                            vm.organizationTree.openCreateOrEditUnitModal({
                                id: node.id,
                                displayName: node.original.displayName
                            }, function (updatedOu) {
                                node.original.displayName = updatedOu.displayName;
                                instance.rename_node(node, vm.organizationTree.generateTextOnTree(updatedOu));
                            });
                        }
                    },

                    addSubUnit: {
                        label: app.localize('AddSubUnit'),
                        _disabled: !vm.permissions.manageOrganizationTree,
                        action: function () {
                            vm.organizationTree.addUnit(node.id);
                        }
                    },

                    addMember: {
                        label: app.localize('AddMember'),
                        _disabled: !vm.permissions.manageMembers,
                        action: function () {
                            vm.members.openAddModal();
                        }
                    },

                    'delete': {
                        label: app.localize("Delete"),
                        _disabled: !vm.permissions.manageOrganizationTree,
                        action: function (data) {
                            var instance = $.jstree.reference(data.reference);

                            abp.message.confirm(
                                app.localize('OrganizationUnitDeleteWarningMessage', node.original.displayName),
                                function (isConfirmed) {
                                    if (isConfirmed) {
                                        organizationUnitService.deleteOrganizationUnit({
                                            id: node.id
                                        }).success(function () {
                                            abp.notify.success(app.localize('SuccessfullyDeleted'));
                                            instance.delete_node(node);
                                            vm.organizationTree.refreshUnitCount();
                                        });
                                    }
                                }
                            );
                        }
                    }
                }

                return items;
            },

            addUnit: function (parentId) {
                var instance = $.jstree.reference(vm.organizationTree.$tree);
                vm.organizationTree.openCreateOrEditUnitModal({
                    parentId: parentId
                }, function (newOu) {
                    instance.create_node(
                        parentId ? instance.get_node(parentId) : '#',
                        {
                            id: newOu.id,
                            parent: newOu.parentId ? newOu.parentId : '#',
                            code: newOu.code,
                            displayName: newOu.displayName,
                            memberCount: 0,
                            text: vm.organizationTree.generateTextOnTree(newOu),
                            state: {
                                opened: true
                            }
                        });

                    vm.organizationTree.refreshUnitCount();
                });
            },

            openCreateOrEditUnitModal: function (organizationUnit, closeCallback) {
                var modalInstance = $modal.open({
                    templateUrl: '~/App/Main/views/organization/createOrEditUnitModal.cshtml',
                    controller: 'app.admin.identity.organizations.createOrEditUnitModal as vm',
                    backdrop: 'static',
                    resolve: {
                        organizationUnit: function () {
                            return organizationUnit;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    closeCallback && closeCallback(result);
                });
            },

            generateTextOnTree: function (ou) {
                var itemClass = ou.memberCount > 0 ? ' ou-text-has-members' : ' ou-text-no-members';
                return '<span title="' + ou.code + '" class="ou-text' + itemClass + '" data-ou-id="' + ou.id + '">' + ou.displayName + ' (<span class="ou-text-member-count">' + ou.memberCount + '</span>) <i class="fa fa-caret-down text-muted"></i></span>';
            },

            incrementMemberCount: function (ouId, incrementAmount) {
                var treeNode = vm.organizationTree.$tree.jstree('get_node', ouId);
                treeNode.original.memberCount = treeNode.original.memberCount + incrementAmount;
                vm.organizationTree.$tree.jstree('rename_node', treeNode, vm.organizationTree.generateTextOnTree(treeNode.original));
            },

            getTreeDataFromServer: function (callback) {
                organizationUnitService.getOrganizationUnits({}).success(function (result) {
                    var treeData = _.map(result.items, function (item) {
                        return {
                            id: item.id,
                            parent: item.parentId ? item.parentId : '#',
                            code: item.code,
                            displayName: item.displayName,
                            memberCount: item.memberCount,
                            text: vm.organizationTree.generateTextOnTree(item),
                            state: {
                                opened: true
                            }
                        };
                    });

                    callback(treeData);
                });
            },

            init: function () {
                vm.organizationTree.getTreeDataFromServer(function (treeData) {
                    vm.organizationTree.setUnitCount(treeData.length);

                    vm.organizationTree.$tree = $('#OrganizationUnitEditTree');

                    var jsTreePlugins = [
                        'types',
                        'contextmenu',
                        'wholerow',
                        'sort'
                    ];

                    if (vm.permissions.manageOrganizationTree) {
                        jsTreePlugins.push('dnd');
                    }

                    vm.organizationTree.$tree
                        .on('changed.jstree', function (e, data) {
                         
                                if (data.selected.length != 1) {
                                    vm.organizationTree.selectedOu.set(null);
                                } else {
                                    var selectedNode = data.instance.get_node(data.selected[0]);
                                    vm.organizationTree.selectedOu.set(selectedNode);
                                }
                         

                        })
                        .on('move_node.jstree', function (e, data) {

                            if (!vm.permissions.manageOrganizationTree) {
                                vm.organizationTree.$tree.jstree('refresh'); //rollback
                                return;
                            }

                            var parentNodeName = (!data.parent || data.parent == '#')
                                ? app.localize('Root')
                                : vm.organizationTree.$tree.jstree('get_node', data.parent).original.displayName;

                            abp.message.confirm(
                                app.localize('OrganizationUnitMoveConfirmMessage', data.node.original.displayName, parentNodeName),
                                function (isConfirmed) {
                                    if (isConfirmed) {
                                        organizationUnitService.moveOrganizationUnit({
                                            id: data.node.id,
                                            newParentId: data.parent
                                        }).success(function () {
                                            abp.notify.success(app.localize('SuccessfullyMoved'));
                                            vm.organizationTree.reload();
                                        }).catch(function (err) {
                                            vm.organizationTree.$tree.jstree('refresh'); //rollback
                                            setTimeout(function () { abp.message.error(err.data.message); }, 500);
                                        });
                                    } else {
                                        vm.organizationTree.$tree.jstree('refresh'); //rollback
                                    }
                                }
                            );
                        })
                        .jstree({
                            'core': {
                                data: treeData,
                                multiple: false,
                                check_callback: function (operation, node, node_parent, node_position, more) {
                                    return true;
                                }
                            },
                            types: {
                                "default": {
                                    "icon": "fa fa-folder tree-item-icon-color icon-lg"
                                },
                                "file": {
                                    "icon": "fa fa-file tree-item-icon-color icon-lg"
                                }
                            },
                            contextmenu: {
                                items: vm.organizationTree.contextMenu
                            },
                            sort: function (node1, node2) {
                                if (this.get_node(node2).original.displayName < this.get_node(node1).original.displayName) {
                                    return 1;
                                }

                                return -1;
                            },
                            plugins: jsTreePlugins
                        });

                    vm.organizationTree.$tree.on('click', '.ou-text .fa-caret-down', function (e) {
                        e.preventDefault();

                        var ouId = $(this).closest('.ou-text').attr('data-ou-id');
                        setTimeout(function () {
                            vm.organizationTree.$tree.jstree('show_contextmenu', ouId);
                        }, 100);
                    });
                });
            },

            reload: function () {
                vm.organizationTree.getTreeDataFromServer(function (treeData) {
                    vm.organizationTree.setUnitCount(treeData.length);
                    vm.organizationTree.$tree.jstree(true).settings.core.data = treeData;
                    vm.organizationTree.$tree.jstree('refresh');
                });
            }
        };
        vm.gridData = [];
       
        //vm.members = {
        //    mainGridOptions:{
        //    dataSource: {
              
        //            //read: {
        //            //    url: "/api/services/app/organizationUnit/GetOrganizationUnitUsers",
        //            //    type: "post"
        //        //},
        //        data: vm.gridData,
        //       // data:[{"name":"System","surname":"Administrator","userName":"admin","emailAddress":"admin@aspnetboilerplate.com","profilePictureId":null,"addedTime":"2016-05-20T00:00:00","id":1}],
        //        dateType: "json",
               
                   
           
                
                
             
        //    },
        //    columns: [
        //       //权限判断
        //       //{ command: [{ template: '<a ng-if="permissions.createPerson" class="k-button" href="\\#" onclick="return toolbar_click()">Command</a>' }], width: 90 },
        //       { field: "userName", title: "编号", width: 75 },
        //       { field: "surname", title: "角色名" }

              
              
        //    ]
        //    },
            
        //    load: function () {
        //        if (!vm.organizationTree.selectedOu.id) {
        //            vm.members.mainGridOptions.totalItems = 0;
        //            vm.members.mainGridOptions.data = [];
        //            return;
        //        }

        //           organizationUnitService.getOrganizationUnitUsers({
        //            id: vm.organizationTree.selectedOu.id
        //        }).success(function (result) {
        //            //vm.members.mainGridOptions.totalItems = result.totalCount;
        //            vm.gridData = result.items;
        //        });
        //    }

        //};
        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/api/services/app/organizationUnit/GetOrganizationUnitUsers",
                    type: "post",
                    contentType: "application/json; charset=utf-8"
                },
           
                dateType: "json",
                parameterMap: function (opts, operation) {


                    if (operation === "read") {

                    

                        return JSON.stringify({ id: vm.organizationTree.selectedOu.id });


                    }
               
                    return {};
                }
            },
      
            //响应到页面的数据
            schema: {
                data: function (data) { return data.result == null ? [] : data.result.items; }
          
            }
           
        
        });
        vm.members={
        gridOptions: {
            dataSource: vm.dataSource,
            
            columns:[
            {


                template: function (dataItem) {
                    return '<div class=\"ui-grid-cell-contents\">' +
                        '  <button class="btn btn-default btn-xs" ng-click="vm.members.remove(dataItem)"><i class="fa fa-trash-o"></i> ' + app.localize('Delete') + '</button>' +
                        '</div>';
                },
                
                title: app.localize('Actions'),
                width: 20
            },
             { field: "userName", title: app.localize('UserName'), width: 140 },
             { field: "addedTime", title: app.localize('AddedTime'), width: 100, format: "{0: yyyy-MM-dd HH:mm}" }
            
            ]
        },
        add: function (userId) {
            var ouId = vm.organizationTree.selectedOu.id;
            if (!ouId) {
                return;
            }

            organizationUnitService.addUserToOrganizationUnit({
                organizationUnitId: ouId,
                userId: userId
            }).success(function () {
                abp.notify.success(app.localize('SuccessfullyAdded'));
                vm.organizationTree.incrementMemberCount(ouId, 1);
                vm.dataSource.read();
            });
        },

        openAddModal: function () {
            var ouId = vm.organizationTree.selectedOu.id;
            if (!ouId) {
                return;
            }
            lookupModal.open({

                title: app.localize('SelectAUser'),
                serviceMethod: commonLookupService.findUsers,

                canSelect: function (item) {
                    return $q(function (resolve, reject) {
                        organizationUnitService.isInOrganizationUnit({
                            userId: item.value,
                            organizationUnitId: ouId
                        }).success(function (result) {
                            if (result) {
                                abp.message.warn(app.localize('UserIsAlreadyInTheOrganizationUnit'));
                            }

                            resolve(!result);
                        }).catch(function () {
                            reject();
                        });
                    });
                },

                callback: function (selectedItem) {
                    vm.members.add(selectedItem.value);
                    vm.dataSource.read();
                }
            });
            
        },
         remove: function(user) {
                var ouId = vm.organizationTree.selectedOu.id;
                if (!ouId) {
                    return;
                }
                abp.message.confirm(
                     app.localize('RemoveUserFromOuWarningMessage', user.userName, vm.organizationTree.selectedOu.displayName),
                     function (isConfirmed) {
                         if (isConfirmed) {
                             organizationUnitService.removeUserFromOrganizationUnit({
                                 organizationUnitId: ouId,
                                 userId: user.id
                             }).success(function () {
                                 abp.notify.success(app.localize('SuccessfullyRemoved'));
                                 vm.organizationTree.incrementMemberCount(ouId, -1);
                                 vm.dataSource.read();
                             });
                         }
                     }
                 );

            }


        }


        vm.organizationTree.init();



    }]);

})();



