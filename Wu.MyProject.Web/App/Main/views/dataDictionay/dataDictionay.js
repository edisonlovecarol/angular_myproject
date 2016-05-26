(function () {
    var appName = "appModule";

    /**
     * Created by gff on 2016/3/21.addMember
     */
    angular.module(appName).controller('app.admin.identity.dataDictionay', [
        'abp.services.app.dataDictionay', '$scope', "$state", '$modal', '$q', function (dataDictionayService, $scope, $state, $modal, $q) {
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
           

            vm.dataDictionayTree = {

                $tree: null,

                unitCount: 0,

                setUnitCount: function (unitCount) {

                    vm.dataDictionayTree.unitCount = unitCount;

                },

                refreshUnitCount: function () {
                    vm.dataDictionayTree.setUnitCount(vm.dataDictionayTree.$tree.jstree('get_json').length);
                },

                selectedOu: {
                    id: null,
                    displayName: null,
                    code: null,

                    set: function (ouInTree) {
                        if (!ouInTree) {
                            vm.dataDictionayTree.selectedOu.id = null;
                            vm.dataDictionayTree.selectedOu.displayName = null;
                            vm.dataDictionayTree.selectedOu.code = null;
                        } else {
                            vm.dataDictionayTree.selectedOu.id = ouInTree.id;
                            vm.dataDictionayTree.selectedOu.displayName = ouInTree.original.displayName;
                            vm.dataDictionayTree.selectedOu.code = ouInTree.original.code;
                        }

                        // vm.members.load();

                       // vm.dataSource.read();
                    }
                },

                contextMenu: function (node) {

                    var items = {
                        editUnit: {
                            label: app.localize('Edit'),
                            _disabled: !vm.permissions.manageOrganizationTree,
                            action: function (data) {
                                var instance = $.jstree.reference(data.reference);

                                vm.dataDictionayTree.openCreateOrEditUnitModal({
                                    id: node.id,
                                    displayName: node.original.displayName
                                }, function (updatedOu) {
                                    node.original.displayName = updatedOu.displayName;
                                    instance.rename_node(node, vm.dataDictionayTree.generateTextOnTree(updatedOu));
                                });
                            }
                        },

                        addSubUnit: {
                            
                            separator_before: false,
                            separator_after: true,
                            label: app.localize('AddSubUnit'),
                            //icon: "btn btn-default btn-xs",
                            _disabled: !vm.permissions.manageOrganizationTree,
                            action: function () {
                                vm.dataDictionayTree.addUnit(node.id);
                            }
                        },

                        //addMember: {
                        //    label: app.localize('AddMember'),
                        //    _disabled: !vm.permissions.manageMembers,
                        //    action: function () {
                        //        vm.members.openAddModal();
                        //    }
                        //},

                        'delete': {
                            label: app.localize("Delete"),
                            _disabled: !vm.permissions.manageOrganizationTree,
                            action: function (data) {
                                var instance = $.jstree.reference(data.reference);

                                abp.message.confirm(
                                    app.localize('DataDictionayDeleteWarningMessage', node.original.displayName),
                                    function (isConfirmed) {
                                        if (isConfirmed) {
                                            dataDictionayService.deleteDataDictionry({
                                                id: node.id
                                            }).success(function () {
                                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                                instance.delete_node(node);
                                                vm.dataDictionayTree.refreshUnitCount();
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
                    var instance = $.jstree.reference(vm.dataDictionayTree.$tree);
                    vm.dataDictionayTree.openCreateOrEditUnitModal({
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
                                text: vm.dataDictionayTree.generateTextOnTree(newOu),
                                state: {
                                    opened: true
                                }
                            });

                        vm.dataDictionayTree.refreshUnitCount();
                    });
                },

                openCreateOrEditUnitModal: function (dataDictionay, closeCallback) {
                    var modalInstance = $modal.open({
                        templateUrl: '~/App/Main/views/dataDictionay/createOrEditUnitModal.cshtml',
                        controller: 'app.admin.identity.dataDictionay.createOrEditUnitModal as vm',
                        backdrop: 'static',
                        resolve: {
                            dataDictionay: function () {
                                return dataDictionay;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        closeCallback && closeCallback(result);
                    });
                },

                generateTextOnTree: function (ou) {
                    var itemClass = ou.memberCount > 0 ? ' ou-text-has-members' : ' ou-text-no-members';
                    return '<span title="' + ou.code + '" class="ou-text' + itemClass + '" data-ou-id="' + ou.id + '">' + ou.displayName+' <i class="fa fa-caret-down text-muted"></i></span>';
                },

                incrementMemberCount: function (ouId, incrementAmount) {
                    var treeNode = vm.dataDictionayTree.$tree.jstree('get_node', ouId);
                    treeNode.original.memberCount = treeNode.original.memberCount + incrementAmount;
                    vm.dataDictionayTree.$tree.jstree('rename_node', treeNode, vm.dataDictionayTree.generateTextOnTree(treeNode.original));
                },

                getTreeDataFromServer: function (callback) {
                    dataDictionayService.getDataDictionry({}).success(function (result) {
                        var treeData = _.map(result.items, function (item) {
                            return {
                                id: item.id,
                                parent: item.parentId ? item.parentId : '#',
                                code: item.code,
                                displayName: item.displayName,
                                memberCount: item.memberCount,
                                text: vm.dataDictionayTree.generateTextOnTree(item),
                                state: {
                                    opened: true
                                }
                            };
                        });

                        callback(treeData);
                    });
                },

                init: function () {
                    vm.dataDictionayTree.getTreeDataFromServer(function (treeData) {
                        vm.dataDictionayTree.setUnitCount(treeData.length);

                        vm.dataDictionayTree.$tree = $('#OrganizationUnitEditTree');

                        var jsTreePlugins = [
                            'types',
                            'contextmenu',
                            'wholerow',
                            'sort'
                        ];

                        if (vm.permissions.manageOrganizationTree) {
                            jsTreePlugins.push('dnd');
                        }

                        vm.dataDictionayTree.$tree
                            .on('changed.jstree', function (e, data) {

                                if (data.selected.length != 1) {
                                    vm.dataDictionayTree.selectedOu.set(null);
                                } else {
                                    var selectedNode = data.instance.get_node(data.selected[0]);
                                    vm.dataDictionayTree.selectedOu.set(selectedNode);
                                }


                            })
                            .on('move_node.jstree', function (e, data) {

                                if (!vm.permissions.manageOrganizationTree) {
                                    vm.dataDictionayTree.$tree.jstree('refresh'); //rollback
                                    return;
                                }

                                var parentNodeName = (!data.parent || data.parent == '#')
                                    ? app.localize('Root')
                                    : vm.dataDictionayTree.$tree.jstree('get_node', data.parent).original.displayName;

                                abp.message.confirm(
                                    app.localize('OrganizationUnitMoveConfirmMessage', data.node.original.displayName, parentNodeName),
                                    function (isConfirmed) {
                                        if (isConfirmed) {
                                            dataDictionayService.MoveDataDictionry({
                                                id: data.node.id,
                                                newParentId: data.parent
                                            }).success(function () {
                                                abp.notify.success(app.localize('SuccessfullyMoved'));
                                                vm.dataDictionayTree.reload();
                                            }).catch(function (err) {
                                                vm.dataDictionayTree.$tree.jstree('refresh'); //rollback
                                                setTimeout(function () { abp.message.error(err.data.message); }, 500);
                                            });
                                        } else {
                                            vm.dataDictionayTree.$tree.jstree('refresh'); //rollback
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
                                    items: vm.dataDictionayTree.contextMenu
                                },
                                sort: function (node1, node2) {
                                    if (this.get_node(node2).original.displayName < this.get_node(node1).original.displayName) {
                                        return 1;
                                    }

                                    return -1;
                                },
                                plugins: jsTreePlugins
                            });

                        vm.dataDictionayTree.$tree.on('click', '.ou-text .fa-caret-down', function (e) {
                            e.preventDefault();

                            var ouId = $(this).closest('.ou-text').attr('data-ou-id');
                            setTimeout(function () {
                                vm.dataDictionayTree.$tree.jstree('show_contextmenu', ouId);
                            }, 100);
                        });
                    });
                },

                reload: function () {
                    vm.dataDictionayTree.getTreeDataFromServer(function (treeData) {
                        vm.dataDictionayTree.setUnitCount(treeData.length);
                        vm.dataDictionayTree.$tree.jstree(true).settings.core.data = treeData;
                        vm.dataDictionayTree.$tree.jstree('refresh');
                    });
                }
            };
           

            vm.dataDictionayTree.init();



        }]);

})();



