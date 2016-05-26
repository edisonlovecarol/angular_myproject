(function () {
    'use strict';
    var controllerId = 'inquiry';
    angular.module('app').controller(controllerId, ['common', 'datacontext', inquiry]);

    function inquiry(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.title = 'Inquiry';



        vm.mainGridDataSource = [];
        vm.LastDetailRow = null;
        vm.detailPartyDataSource = [];
        vm.detailCrossDataSource = [];
        vm.mainGridOptions = {
            sortable: true,
            selectable: true,
            groupable: true,
            filterable: true,
            reorderable: true,
            resizable: true,
            detailExpand: function (arg) {
                if (vm.LastDetailRow != null && vm.LastDetailRow.index() != arg.masterRow.index()) {

                    arg.sender.collapseRow(vm.LastDetailRow);
                }

                vm.LastDetailRow = arg.masterRow;
            },
            dataBound: function () {
                var grid = this;
                grid.tbody.find("tr.k-grouping-row").each(function () { grid.collapseGroup(this); });
            },
            columns: [{
                field: "documentInstrument",
                title: "Instrument",
                width: "150px"
            }, {
                field: "documentDate",
                title: "Document Date",
                width: "150px"
            }, {
                field: "documentBookPage",
                title: "Book & Page",
                width: "150px"
            }, {
                field: "documentNameType",
                title: "Name Type",
                width: "120px"
            }, {
                field: "documentName",
                title: "Name",
                width: "250px"
            }, {
                field: "documentType",
                title: "Document Type",
                width: "250px"
            }, {
                field: "documentLegal",
                title: "Legal Description",
                width: "300px"

            }],
            dataSource: {

                data: vm.mainGridDataSource,
                dataType: "json"
            }
        };
        vm.detailPartyOptions = function (dataItem) {
            return ({
                dataSource: {
                    data: datacontext.getParty(dataItem.documentInstrument).then(function (data) { return vm.detailPartyDataSource = data }),
                    type: "json"
                },

                scrollable: false,
                sortable: true,
                columns: [
                { field: "name", title: "Name" },
                { field: "nameType", title: "Name Type" },
                { field: "bookPage", title: "Book & Page" },
                { field: "docType", title: "Document Type" },
                { field: "date", title: "Date" },
                { field: "indexed", title: "Indexed" }
                ]
            });

        };
        vm.detailCrossOptions = function (dataItem) {
            return {
                dataSource: {
                    data: datacontext.getCross(dataItem.documentInstrument).then(function (data) { return vm.detailCrossDataSource = data }),
                    type: "json"
                },

                scrollable: false,
                sortable: true,
                columns: [
                { field: "xInstrument", title: "Instrument" },
                { field: "xReference", title: "Reference" },
                { field: "xDate", title: "Date" },
                { field: "xDocType", title: "Document Type" },
                { field: "xBookPage", title: "Book & Page" },
                { field: "xLegalDesc", title: "Legal Description" }
                ]
            };
        };
        vm.search = function (startDateString, endDateString, lastName, selectedDocType) {

            return datacontext.getBusiness(startDateString, endDateString, lastName, selectedDocType).then(function (data) {
                return vm.mainGridDataSource = data;
            })
        };

        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Inquiry View'); });

        };

    }
})();