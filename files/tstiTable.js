

function regeditTable(tableId, tableData, columns, otherProp) {
    var scrollCollapse = true;
    var paging = false;
    var searching = false;
    var ordering = true;
    var JQueryUI = false;
    var fnRowCallback = "";
    var rowReorder = false;
    var columnDefs = false;
    var jTable = $('#' + tableId);
    var scrollX = null;
    var scrollY = null;

    var dom = 't';

    if (otherProp != undefined && otherProp != null) {
        if (otherProp["JQueryUI"] != undefined) {
            JQueryUI = otherProp["JQueryUI"];
            if (otherProp["JQueryUI"]) {                
                dom = 'lfrtip';
            }
        }
        if (otherProp["searching"] != undefined) {
            searching = otherProp["searching"];
        }
        if (otherProp["dom"] != undefined) {
            dom = otherProp["dom"];
        }
        if (otherProp["scrollX"] != undefined) {
            scrollX = otherProp["scrollX"];
        }
        if (otherProp["scrollY"] != undefined) {
            scrollY = otherProp["scrollY"];
        }
        if (otherProp["scrollCollapse"] != undefined) {
            scrollCollapse = otherProp["scrollCollapse"];
        }
        if (otherProp["paging"] != undefined) {
            paging = otherProp["paging"];
        }
        if (otherProp["searching"] != undefined) {
            searching = otherProp["searching"];
        }
        if (otherProp["ordering"] != undefined) {
            ordering = otherProp["ordering"];
        }
        if (otherProp["fnRowCallback"] != undefined) {
            fnRowCallback = otherProp["fnRowCallback"];
        }
        if (otherProp["rowReorder"]!= undefined) {
            rowReorder = otherProp["rowReorder"];
        }
        if (otherProp["columnDefs"] != undefined) {
            columnDefs = otherProp["columnDefs"];
            }
    }

    var language = {
        "emptyTable": "無任何資料!!",
        "zeroRecords": "無任何資料!!",
        "info": "顯示 _TOTAL_ 筆資料中的第 _START_ 到 _END_ 筆",
        "lengthMenu": "單頁顯示 _MENU_ 筆",
        "infoEmpty": "無任何資料!!",
        "search": "搜尋:",
        "infoFiltered": "",
        "paginate": {
            "first": "首筆",
            "last": "末筆",
            "next": "下一頁",
            "previous": "上一頁"
        }
    };

    var item = {};
    item['data'] = tableData;
    item['columns'] = columns;
    if (scrollX == true || scrollX == false) 
        item['scrollX'] = scrollX;
    if (scrollY != null) 
        item['scrollY'] = scrollY;
    item['scrollCollapse'] = scrollCollapse;
    item['JQueryUI'] = JQueryUI;
    item['paging'] = paging;
    item['searching'] = searching;
    item['ordering'] = ordering;
    item['dom'] = dom;
    item['language'] = language;
    item['fnRowCallback'] = fnRowCallback;
    if (rowReorder)
        item['rowReorder'] = rowReorder;
    if (columnDefs) {
        item['columnDefs']= columnDefs;
    }
        
    var table = jTable.DataTable(item);

    return table;
}

function reloadData(tableId, data) {
    var table = $('#' + tableId).DataTable();
    table.clear().rows.add(data).draw();
    return table;
}

function addRowsData(tableId, data) {
    var table = $('#' + tableId).DataTable();
    table.rows.add(data).draw();
    return table;
}

function clearData(tableId) {
    var table = $('#' + tableId).DataTable();
    table.clear();
}

function delRowsData(tableID , rowData) {
    var table = $('#' + tableID).DataTable();
    table.row($(rowData).parents('tr')).remove().draw();
}

function getTableSelectCheckBoxValue(tableId) {
    var jsonObj = [];
    var allTr = $('#' + tableId + ' tbody tr');
    allTr.each(function () {
        var myChkBox = $(this).find("td:eq(0) input:checkbox");
        if (myChkBox.length != 0) {
            if (myChkBox.is(":checked")) {
                jsonObj.push(myChkBox.val());
            }
        }
    });
    return jsonObj;
}


/*  取得table資料轉換為jsonString格式
 * 若th定義屬性 data-override="overridden column name" 則用該名稱當key，否則拿該th的值當key
 *
*/
function tableToJsonString(tableId, includeHidden) {
    var d;
    if (includeHidden == null || includeHidden == undefined || includeHidden)
        d = $('#' + tableId).tableToJSON({ ignoreHiddenRows: false });
    else
        d = $('#' + tableId).tableToJSON();
    var jsonString = JSON.stringify(d);
    if (jsonString.indexOf('無任何資料!!') > 0) {
        return "[]";
    }
    return jsonString;
}


/*  取得Div中所有已勾選的Checkbox Value
*/
function getDivSelectCheckBoxValue(divId) {
    var jsonObj = [];
    var allTr = $('#' + divId).find("input[type='checkbox']");
    allTr.each(function () {
        var myChkBox = $(this);
        if (myChkBox.is(":checked")) {
            jsonObj.push(myChkBox.val());
        }
    });
    return jsonObj;
}


/*  
  設定Div裡的Checkbox接全選或全不選
*/
function setDivCheckBoxValue(divId , boolChecked) {
    var allTr = $('#' + divId).find("input[type='checkbox']");
    allTr.each(function () {
        var myChkBox = $(this);
        if (boolChecked)
            myChkBox.prop('checked', true);
        else
            myChkBox.prop('checked', false);
    });
}

function refreshTable(tableId, data, tableDef) {
    if (typeof data === 'object') {
    }
    else if (typeof data === 'string')
        data = $.parseJSON(data);
    else {
        showMsg("data欄位必須給值");
        return;
    }
    if (!$.fn.DataTable.isDataTable('#' + tableId)) {
        regeditTable(tableId, data, tableDef[tableId + "_cols"], tableDef[tableId + "_props"]);
    } else {
        reloadData(tableId, data);
    }
    $("#" + tableId).dataTable().fnAdjustColumnSizing();
}

function getTableLangSetting(lang) {
    var data = null;
    if (lang == 'zh-TW')
        data = {
            "emptyTable": "無任何資料!!",
            "zeroRecords": "無任何資料!!",
            "info": "顯示 _TOTAL_ 筆資料中的第 _START_ 到 _END_ 筆",
            "lengthMenu": "單頁顯示 _MENU_ 筆",
            "infoEmpty": "無任何資料!!",
            "search": "搜尋:",
            "infoFiltered": "",
            "paginate": {
                "first": "首筆",
                "last": "末筆",
                "next": "下一頁",
                "previous": "上一頁"
            }
        };
    return data;
}


