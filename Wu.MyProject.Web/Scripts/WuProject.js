(function ($) {
    $.osharp = $.osharp || { version: 1.0, vtime: (new Date().getTime()) };
})(jQuery);
(function ($) {
    //工具
    $.osharp.tools = {
        url: {
            encode: function (url) {
                return encodeURIComponent(url);
            },
            decode: function (url) {
                return decodeURIComponent(url);
            }
        },
        valueToText: function (value, array, defaultText) {
            var text = defaultText == undefined ? value : defaultText;
            $.each(array, function () {
                if (this.id != undefined && this.id === value) {
                    text = this.text;
                    return false;
                }
                if (this.id != undefined && this.id === value) {
                    text = this.text;
                    return false;
                }
                return true;
            });
            return text;
        },
        expandAndToString: function (array, separator) {
            var result = "";
            if (!separator) {
                separator = ",";
            }
            $.each(array, function (index, item) {
                result = result + item.toString() + separator;
            });
            return result.substring(0, result.length - separator.length);
        },
        renderBoolean: function (flag) {
            return flag ? "<div class=\"checker\"><span class=\"checked\"></span></div>" : "<div class=\"checker\"><span></span></div>";
        },
        timeFormat: function (time, formatStr) {
            if (!(time instanceof Date)) {
                return time;
            }
            if (!Date.prototype.format) {
                Date.prototype.format = function (format) {
                    var o = {
                        "M+": this.getMonth() + 1, //month
                        "d+": this.getDate(), //day
                        "h+": this.getHours(), //hour
                        "m+": this.getMinutes(), //minute
                        "s+": this.getSeconds(), //second
                        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                        "S": this.getMilliseconds() //millisecond
                    }
                    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o) if (new RegExp("(" + k + ")").test(format))
                        format = format.replace(RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] :
                        ("00" + o[k]).substr(("" + o[k]).length));
                    return format;
                }
            }
            return time.format(formatStr);
        }
    };


    $.osharp.qid = {};

    //数据查询
    $.osharp.filter = {
        Rule: function (field, value, operate) {
            this.Field = field;
            this.Value = value;
            this.Operate = operate || "equal";
            
        },

       

        Group: function () {
            this.Rules = [];
            this.Operate = "and";
            this.Groups = [];
            this.Pages= {}
        }
    };
    //tip
    $.osharp.tip = {
        msg: function (content, type, close) {
            close = close == undefined ? true : close;
            $.bootstrapGrowl(content, {
                ele: "body",
                type: type,
                width: 300,
                align: "center",
                delay: type === "danger" ? 6000 : 4000,
                allow_dismiss: close,
                stackup_spacing: 10,
                offset: {
                    from: "top",
                    amount: 50
                }
            });
        },
        success: function (content) { this.msg(content, "success"); },
        info: function (content) { this.msg(content, "info"); },
        warning: function (content) { this.msg(content, "warning", close); },
        danger: function (content) { this.msg(content, "danger", close); }
    };
    $.osharp.tip2 = {
        msg: function (content, type, title) {
            toastr.options = {
                timeOut: type === "error" ? "6000" : "3000",
                "positionClass": "toast-top-center",
                closeButton: true,
                "newestOnTop": false
            };
            toastr[type](content, title);
        },
        success: function (content) { this.msg(content, "success"); },
        info: function (content) { this.msg(content, "info"); },
        waring: function (content) { this.msg(content, "waring"); },
        danger: function (content) { this.msg(content, "error"); }
    };

    //kendo
    $.osharp.kendo = {
        getFilterGroup: function (filter, funcFieldReplace, group) {
            var filterGroup = group;
            if (!filter.filters || !filter.filters.length) {
                return null;
            }
            //var group = new $.osharp.filter.Group();
            var filters = filter.filters;
            //添加属性pages

            //group.Pages.PageIndex = options.page;
            //group.Pages.PageSize = options.pageSize ? options.pageSize : 100000000;
            //var fields;
            //var orders;
            //if (options.sort && options.sort.length) {
            //    var sortFields = [], sortOrders = [];
            //    for (var i = 0; i < options.sort.length; i++) {
            //        var sort = options.sort[i];
            //        sortFields.push(sort.field.substring(0, 1).toLocaleUpperCase() + sort.field.substring(1));
            //        sortOrders.push(sort.dir);
            //    }
            //    fields = $.osharp.tools.expandAndToString(sortFields);
            //    orders = $.osharp.tools.expandAndToString(sortOrders);
            //}

            //var sortString = { SortFields: fields, SortOrders: orders };
            //group.Pages.SortString = sortString;

            for (var i = 0; i < filter.filters.length; i++) {
                var filter1 = filters[i];
                if (filter1.filters && filter1.filters.length) {
                    filterGroup.Groups.push(getFilterGroup(filter1, funcFieldReplace));
                } else {
                    filterGroup.Rules.push(getFilterRule(filter1, funcFieldReplace));
                }
            }
            filterGroup.Operate = filter.logic;
            return filterGroup;

            function renderRuleOperate(operator) {
                if (operator === "eq") return "equal";
                if (operator === "neq") return "notequal";
                if (operator === "gt") return "greater";
                if (operator === "gte") return "greaterorequal";
                if (operator === "lt") return "less";
                if (operator === "lte") return "lessorequal";
                if (operator === "doesnotcontain") return "notcontains";
                return operator;
            }

            function getFilterRule(filter, funcFieldReplace) {
                if (funcFieldReplace && !$.isFunction(funcFieldReplace)) {
                    throw ("funcFieldReplace must be function");
                }

                var field = funcFieldReplace(filter.field).substring(0, 1).toLocaleUpperCase() + filter.field.substring(1);
                var operate = renderRuleOperate(filter.operator);
                var rule = new $.osharp.filter.Rule(field, filter.value, operate);
                return rule;
            }

        },

        //test11: function() {
        //    var group = new $.osharp.filter.Group();

        //},
        timeParse: function (time) {
            if (!time) {
                return time;
            }
            if ((typeof time) == "string") {
                time = new Date(parseInt(time.slice(6, 19)));
            }
            time = kendo.toString(new Date(time), "yyyy-MM-dd HH:mm");
            return time;
        }
    };


    $.osharp.kendo.grid = {
        //处理KendoUI到OSharp框架的查询参数

       

        readParameterMap: function (options, funcFieldReplace, QueryData) {

            if (QueryData.hasOwnProperty('id')) {

                //return JSON.stringify({ Rules: [{ Field: "Id", Operate: "equal", Value: QueryData.id }], Groups: [], Pages: { PageIndex: 1, PageSize: 15, SortString: { SortFields: "Id", SortOrders: "desc" } }, Operate: "And" });
                return JSON.stringify({ id: QueryData.id });

            } else {
                

            
            var group = new $.osharp.filter.Group();
            group.Pages.PageIndex = options.page;
            group.Pages.PageSize = options.pageSize ? options.pageSize : 100000000;

            if (options.sort && options.sort.length) {
                var fields;
                var orders;
                if (options.sort && options.sort.length) {
                    var sortFields = [], sortOrders = [];
                    for (var i = 0; i < options.sort.length; i++) {
                        var sort = options.sort[i];
                        sortFields.push(sort.field.substring(0, 1).toLocaleUpperCase() + sort.field.substring(1));
                        sortOrders.push(sort.dir);
                    }
                    fields = $.osharp.tools.expandAndToString(sortFields);
                    orders = $.osharp.tools.expandAndToString(sortOrders);
                }

                var sortString = { SortFields: fields, SortOrders: orders };
                group.Pages.SortString = sortString;
            }
            if (options.filter && options.filter.filters.length) {
                var filterGroup = $.osharp.kendo.getFilterGroup(options.filter, funcFieldReplace, group);
                return JSON.stringify(filterGroup);

               

            } else {
                //paramter = JSON.stringify({ Rules: [{ Field: "DdlName", Operate: "Contains", Value: "辽宁" }], Groups: [], Pages: { PageIndex: 11, PageSize: 20, SortString: { SortFields: "Id", SortOrders: "desc" } }, Operate: "And" });
                // return JSON.stringify({ Rules: [], Groups: [], Pages: { PageIndex: 1, PageSize: 5, SortString: { SortFields: "Id", SortOrders: "desc" } }, Operate: "And" });
                
                return JSON.stringify(group);

            }

            
            return paramter;
            }
        },
        Options: function (options) {
            if (!options.url) {
                throw ("url must be defined");
            }
            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: options.url.read ? options.url.read : undefined,
                        type: "post",
                        contentType: "application/json; charset=utf-8"
                    },
                    // read: options.read,
                    create: {
                        url: options.url.create ? options.url.create : undefined,
                        type: "post",
                        contentType: "application/json; charset=utf-8"
                    },
                    update: {
                        url: options.url.update ? options.url.update : undefined,
                        type: "post",
                        contentType: "application/json; charset=utf-8"
                    },
                    destroy: {
                        url: options.url.destroy ? options.url.destroy : undefined,
                        type: "post",
                        contentType: "application/json; charset=utf-8"
                    },
                    dateType: "json",
                    parameterMap: function(opts, operation) {


                        if (operation === "read") {

                            return $.osharp.kendo.grid.readParameterMap(opts, options.funcFieldReplace != undefined ? options.funcFieldReplace : funcFieldReplace, $.osharp.qid);


                            //pp.input = JSON.stringify({ Rules: [{ Field: "DdlName", Operate: "Contains", Value: "安徽" }], Groups: [], Operate: "And" });
                            //return pp;
                            //return JSON.stringify({ Rules: [{ Field: "DdlName", Operate: "Contains", Value: "辽宁" }], Groups: [], Operate: "And" });
                            //return JSON.stringify({ Rules: [], Groups: [], Operate: "And" });
                            // return {pageIndex:1}
                            //return { Rules: [], Groups: [], Operate: "And" };
                            

                        }
                        if (operation === "create" || operation === "update") {
                            //return { input: opts.models[0] };
                            //return {"":opts.models}
                           
                            var josn = opts.models[0];
                            if ($.osharp.qid.dataDictionaryId) {
                                josn.DataDictionaryId = $.osharp.qid.dataDictionaryId;
                            }
                            // $scope.dataDictionaryTree.$tree.jstree('refresh'); //rollback

                            return JSON.stringify(josn);
                        }
                        if (operation === "destroy" && opts.models.length) {
                            //var ids = $.Enumerable.From(opts.models).Select(function (m) { return m.Id; }).ToArray();
                            //return { ids: ids };

                            var ids = $.Enumerable.From(opts.models).Select(function(m) { return m.id; }).ToArray();
                            //return { ids: ids };
                            return JSON.stringify({ id: ids[0] });
                        }
                        return {};
                    }
                },
                group: options.group ? options.group : [],
                //schema: {
                //    model: options.model ? options.model : {},
                //    data: function (d) { return d.Rows; },
                //    total: function (d) { return d.Total; }
                //},
                //响应到页面的数据
                schema: {
                    data: function(data) { return data.result == null ? [] : data.result.items; },
                    model: options.model ? options.model : {},
                    total: function(d) { return d.result.totalCount; }


                },
                batch: options.batch != undefined ? options.batch : true,
                pageSize: options.pageSize ? options.pageSize : 10,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                requestEnd: requestEnd,
                


        });
            return {
                dataSource: dataSource,
                columns: options.columns,
                toolbar: options.toolbar != undefined ? options.toolbar : ["create", "save", "cancel"],
                navigatable: true,
                height: options.height != undefined ? options.height : null,
                filterable: options.filterable != undefined ? options.filterable : true,
                resizable: options.resizable != undefined ? options.resizable : true,
                scrollable: options.scrollable != undefined ? options.scrollable : true,
                selectable: options.selectable != undefined ? options.selectable : true,
                reorderable: options.reorderable != undefined ? options.reorderable : true,
                columnMenu: options.columnMenu != undefined ? options.columnMenu : false,
                sortable: options.sortable != undefined ? options.sortable : { mode: "multiple", allowUnsort: true },
                pageable: options.pageable != undefined ? options.pageable : { refresh: true, pageSizes: [10, 15, 30, "all"], buttonCount: 5 },
                editable: options.editable != undefined ? options.editable : { mode: "incell", confirmation: true },
                saveChanges: function (e) {
                    if (!confirm("是否提交对表格的更改？")) {
                        e.preventDefault();
                    }
                },
                //重新加载
                load: function () {

                   
                    dataSource.read();
                }
            };

            function funcFieldReplace(field) {
                return field;
            }



            function requestEnd(e) {
                if (!e.response) {
                    return;
                }
                if (e.type === "read") {
                    return;
                }
          
                //if (!data.Type) {
                //    return;
                //}
                //if (data.Type === "Error") {
                //    $.osharp.tip2.danger(data.Content);
                //    return;
                //}
                //if (data.Type === "Info") {
                //    $.osharp.tip2.info(data.Content);
                //}
                //if (data.Type === "Success") {
                //    $.osharp.tip2.success(data.Content);
                //}
                var data = e.response;
                if (data.success && e.type === "create") {

                    abp.notify.info(app.localize('SavedSuccessfully'));
                }

                if (data.success && e.type === "destroy") {
                    abp.notify.info(app.localize('SuccessfullyDeleted'));
                }
                if (data.success && e.type === "update") {
                    abp.notify.info(app.localize('SuccessfullyUpdated'));
                }

                dataSource.read();
            }
        },


        DropDownListEditor: function (container, options, dataSource, textField, valueField) {
            var input = $("<input />");
            input.attr("name", options.field);
            input.appendTo(container);
            input.kendoDropDownList({
                dataTextField: textField != undefined ? textField : "text",
                dataValueField: valueField != undefined ? valueField : "id",
                dataSource: dataSource
            });
        },
        RemoteDropDownListEditor: function (container, options, url, textField, valueField) {
            var input = $("<input />");
            input.attr("name", options.field);
            input.appendTo(container);
            input.kendoDropDownList({
                autoBind: false,
                dataTextField: textField != undefined ? textField : "text",
                dataValueField: valueField != undefined ? valueField : "id",
                dataSource: {
                    transport: {
                        dateType: "json",
                        read: url
                    }
                }
            });
        },
        ComboBoxEditor: function (container, options, dataSource, textField, valueField) {
            var input = $("<input />");
            input.attr("name", options.field);
            input.appendTo(container);
            input.kendoComboBox({
                dataTextField: textField != undefined ? textField : "text",
                dataValueField: valueField != undefined ? valueField : "id",
                dataSource: dataSource
            });
        },
        RemoteComboBoxEditor: function (container, options, url, textField, valueField) {
            var input = $("<input />");
            input.attr("name", options.field);
            input.appendTo(container);
            input.kendoComboBox({
                autoBind: false,
                dataTextField: textField != undefined ? textField : "text",
                dataValueField: valueField != undefined ? valueField : "id",
                dataSource: {
                    transport: {
                        dateType: "json",
                        read: url
                    }
                }
            });
        },
        DateEditor: function (container, options) {
            var input = $("<input />");
            input.attr("name", options.field);
            input.appendTo(container);
            input.kendoDatePicker({
                format: "yyyy-MM-dd HH:mm:ss"
            });
        }

    };
})(jQuery);

(function ($) {
    $.osharp.data = {
        functionTypes: [{ id: 0, text: "匿名访问" }, { id: 1, text: "登录访问" }, { id: 2, text: "角色访问" }],
        filterType: [{ id: 0, text: "允许" }, { id: 1, text: "拒绝" }]
    };
})(jQuery);
