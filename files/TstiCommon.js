
//螢幕列印  obj為jquery物件
function tstiPrint(obj) {
    var printData = obj.clone();
    var printInfo = getPrinterInfo();

    var defaultScript = $('#_scriptCss').html();

    var p = printData.wrap('<div></div>').parent();
    printData.before(defaultScript+printInfo);
    p.printArea({ mode: "popup", popHt: 600, popWd: 700, popX: 0, popY: 0, popClose: true });
}

(function (original) {
    jQuery.fn.clone = function () {
        var result = original.apply(this, arguments),
            my_textareas = this.find('textarea').add(this.filter('textarea')),
            result_textareas = result.find('textarea').add(result.filter('textarea')),
            my_selects = this.find('select').add(this.filter('select')),
            result_selects = result.find('select').add(result.filter('select'));

        for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
        for (var i = 0, l = my_selects.length; i < l; ++i) {
            for (var j = 0, m = my_selects[i].options.length; j < m; ++j) {
                if (my_selects[i].options[j].selected === true) {
                    result_selects[i].options[j].selected = true;
                }
            }
        }
        return result;
    };
})(jQuery.fn.clone);


function getPrinterInfo() {
    var nowDate = new Date();
    var sDate = nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate();
    var sTime = nowDate.getHours() + ':' + nowDate.getMinutes() + ':' + nowDate.getSeconds();
    var sName = _opId + ' ' + _opName;

    var printField = '<div style="float:right">';
    printField += '列印日期<input style="width: 70px;" type="text"  value="' + sDate + '" /> ';
    printField += '列印時間<input style="width: 70px;" type="text"  value="' + sTime + '" /> ';
    printField += '列印人員<input style="width: 150px;" type="text" value="' + sName + '" />';
    printField += '</div><br/>';
    return printField;
}

//檢查是否為純數字 
function v_checkDigit(num) {
    var reg = /^[0-9]+$/;
    if (!reg.test(num))
        return false;
    else
        return true;
}

//檢查是否為數值
function v_checkNumber(num) {
    return !isNaN(num);
}



function closeTab() {
    try {
        var frameId = $(window.frameElement).attr('id');
        var tbody = $(window.frameElement).closest('tbody');
        var allBtn = tbody.find('td span[name="' + frameId + '"]');
        allBtn.each(function () {
            if ($(this).hasClass('ui-icon-close')) {
                try {
                    //this.click(); 
                    $(this).trigger('click');
                } catch (E) { }
            }
        });
    } catch (e) {
        alert(e);
    }
}
/*
function ShowDialog(Title, Message, Buttons) {
    var obj = window.top.document.getElementById('DivAlertMessage');
    var nowMyButton = $(obj).parent().find('#_myButton');
    if (nowMyButton.length >= 0) {
        nowMyButton.remove();
    }

    $("<button type='button' id='_myButton' style='display:none' onclick=''></button>").insertAfter($(obj));
    $(obj).parent().find('#_myButton').bind('click', function () {        ;
        var obj1 = this.ownerDocument.getElementById('DivAlertMessage');
        try {
            $(obj1).dialog("destroy");
        } catch (e) {
        }
        document = this.ownerDocument;
        $(obj1).html(Message)
            .dialog({
                modal: true,
                resizable: false,
                title: Title,
                buttons: {
                    關閉: function () {
                        $(this).dialog('close');
                    }
                }
            });
    });

    $(window.top.document.getElementById('_myButton')).click();
}

function ShowMessage(Title, Message) {
    try {
        $("#DivAlertMessage").dialog("destroy");
    } catch (e) {
    }
    $('#DivAlertMessage')
        .html(Message)
        .dialog({
            modal: true,
            resizable: false,
            title: Title,
            buttons: {
                關閉: function () {
                    $(this).dialog('close');
                }
            }
        });
}

// Show Message Dialog
function ShowConfirm(Title, Message, CallBack) {
    try {
        $("#DivConfirm").dialog("destroy");
    } catch (e) {
    }
    $('#DivConfirm')
        .html(Message)
        .dialog({
            modal: true,
            resizable: false,
            title: Title,
            buttons: {
                是: function () {
                    $(this).dialog('close');
                    CallBack(true);
                },
                否: function () {
                    $(this).dialog('close');
                    CallBack(false);
                }
            }
        });
}
*/

//停止事件往上傳
function stopBubbleEvent(e) {
    if (!e)
        e = window.event;

    //IE9 & Other Browsers
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    else {
        //IE8 and Lower
        e.cancelBubble = true;
    }
}

function showMsg(msg) {
    alert(msg);
}

function getTccClientHeight() {
    var height = $(window.frameElement).height();
    //經過嚴密計算 IE 要少16,Chrome 要少14才不會導致出現scrollBar，所以以大的為主減16
    if (height == null || height == 0) {
        height = window.screen.availHeight -80;
    }
    var res = height - 16;
    return res;
}

function jsonDataToView(json, preText, preId) {
    var qry;
    if (preId == undefined || preId == null)
        qry = $('body');
    else
        qry = $('#' + preId);
    if (preText == undefined || preText == null)
        preText = "";

    $.each(json, function (key, val) {
        var realKey = preText + key;
        var obj = qry.find('#' + realKey);
        if (obj[0] == null)
            obj = qry.find('input[name="' + realKey + '"]');
        if (obj[0] != null) {
            var tagName = obj[0].tagName.toUpperCase();
            if (tagName == "INPUT") {
                var type = obj.attr("type").toUpperCase();;
                if (type == "TEXT") {
                    obj.val(val);
                } else if (type == "RADIO") {
                    obj.each(function () {
                        var v = $(this).val();
                        if (v == val) {
                            $(this).prop("checked", true);
                        }
                    });
                } else if (type == "CHECKBOX") {
                    obj.prop("checked", false);
                    var datas = val.split(",");
                    obj.each(function () {
                        var v = $(this).val();
                        if (jQuery.inArray(v, datas) >= 0) {
                            $(this).prop("checked", true);
                        }
                    });
                }
            } else if (tagName == "LABEL" || tagName == "TD" || tagName == "DIV") {
                obj.html(val);
            } else if (tagName == "SELECT") {
                obj.find("option").filter(function () {
                    return $(this).attr("value") == val;
                }).prop('selected', true);
            }
        }

    });
}

function isJSON(something) {
    if (typeof something != 'string')
        something = JSON.stringify(something);

    try {
        JSON.parse(something);
        return true;
    } catch (e) {
        return false;
    }
}

function changeSelectOption(id, json, selectValue, headerKey,defalutOpt) {
    changeSelectOptionObj($('#' + id), json, selectValue, headerKey, defalutOpt);
}

function changeSelectOptionObj(jqueryObj, json, selectValue, headerKey, defalutOpt) {
    if (headerKey == undefined || headerKey == null)
        headerKey = true;

    var obj = jqueryObj.find('option').remove().end();
    if (json == undefined || json == null || json.length == 0)
        return;

    if (defalutOpt) {
        obj = obj.append('<option value=""> 請選擇 </option>')
    }

    $.each(json, function (key, val) {
        if (headerKey) {
            if (selectValue == key)
                obj = obj.append('<option selected="selected" value="' + key + '">' + val + '</option>')
            else
                obj = obj.append('<option value="' + key + '">' + val + '</option>');
        } else {
            if (selectValue == val)
                obj = obj.append('<option selected="selected" value="' + val + '">' + key + '</option>')
            else
                obj = obj.append('<option value="' + val + '">' + key + '</option>');
        }

    });
}

function changeRadioOption(id, name, json) {
    var i = 0;
    var obj = $('#' + id).find('label').remove().end();
    $.each(json, function (key, val) {
        i = i + 1;
        if (i == 1)
            obj = obj.append('<label class="radio-inline">' + '<input  type="radio" checked = "checked" value="' + key + '" name="' + name + '"/>' + val + '</label>');
        else
            obj = obj.append('<label class="radio-inline">' + '<input  type="radio" value="' + key + '" name="' + name + '"/>' + val + '</label>');
    });
}

function setSelectValue(id, value) {
    setSelectValueObj($("#" + id), value);
}

function setSelectValueObj(jqueryObj, value) {
    jqueryObj.find("option").filter(function () {
        var ss = $(this).attr("value") == value;
        return $(this).attr("value") == value;
    }).prop('selected', true);
}

//將指定id內的input欄位，設定是否可編輯 (如果是a tag則需指定class allowHide)
function htmlEnabled(id, enabled) {
    $('#' + id + ' input').prop("disabled", !enabled);
    $('#' + id + ' input').prop("readonly", !enabled);
    $('#' + id + ' select').prop("disabled", !enabled);
    $('#' + id + ' textarea').prop("readonly", !enabled);
    if (enabled)
        $('#' + id + ' a.allowHide').show();
    else
        $('#' + id + ' a.allowHide').hide();
}

$.fn.serializeObject = function () {
    var unindexed_array = this.serializeArray();
    var indexed_array = {};
    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });
    return indexed_array;
};


function multipleSelect_MoveToAdd(srcSel, desSel) {
    var s1 = $("#" + srcSel);
    var s2 = $("#" + desSel);
    s1.find(":selected").each(function () {
        var hasData = false;
        var text = this.text;
        var value = this.value;

        s2.children().each(function () {
            if ($(this).val() == value) {
                hasData = true;
            }
        });

        if (!hasData) {
            s2.append($("<option></option>").attr("value", value).text(text));
        }
    });
    s1.find(":selected").remove();
}

function multipleSelect_MoveToRemove(srcSel, desSel) {
    var s1 = $("#" + srcSel);
    var s2 = $("#" + desSel);
    s2.find(":selected").each(function () {
        var hasData = false;
        var text = this.text;
        var value = this.value;

        s1.children().each(function () {
            if ($(this).val() == value) {
                hasData = true;
            }
        });
        if (!hasData) {
            s1.append($("<option></option>").attr("value", value).text(text));
        }
    });
    s2.find(":selected").remove();
}

function multipleSelect_AddToSrcFromJSON(srcSel, desSel, json) {
    var s1 = $("#" + srcSel);
    var s2 = $("#" + desSel);
    s1.empty();
    for (var key in json) {
        var hasData = false;
        s2.children().each(function () {
            if ($(this).val() == key) {
                hasData = true;
            }
        });
        if (!hasData) {
            s1.append($("<option></option>").attr("value", key).text(json[key]));
        }
    }
}

//報表顯示
function doCommonReport(actionName, data) {
    ajaxSend(actionName, data, doCommonReportAfter);
}

function doCommonReportAfter() {
    var myframe = document.getElementById("ifrmReportViewer");
    if (myframe !== null) {
        var url = "/cyan/Pages/Report/ReportView.aspx";
        if (myframe.src) {
            myframe.src = url;
        }
        else if (myframe.contentWindow !== null && myframe.contentWindow.location !== null) {
            myframe.contentWindow.location = url;
        }
        else { myframe.setAttribute('src', url); }
    }
}

function doLogout() {
    if (confirm("Logout ？"))
        ajaxSend("Logout", null, doLogoutAfter);
}

function doLogoutAfter() {
    showMsg("You logged out!");
    window.location.href = "../Common/SysLogin.aspx";
}

function doGuestLogout() {
    ajaxSend("Logout", null, doGuestLogoutAfter);
}

function doGuestLogoutAfter() {
    window.location.href = "../Common/SysLogin.aspx";
}

function setInputTitleByPhone(targetId) {
    $("#" + targetId).attr("title", "範例格式:02-1234567");
}

function setInputTitleByFax(targetId) {
    $("#" + targetId).attr("title", "範例格式:021234567");
}


function setInputTitleByCellPhone(targetId) {
    $("#" + targetId).attr("title", "範例格式:0912-123456");
}

function initTimePicker(targetId) {
    $("#" + targetId).timepicker();
}


function initDatePickerForDay(targetId) {
    $("#" + targetId).datepicker({ dateFormat: "yy-mm-dd" });
}

function initDatePickerForMonth(targetId) {
    $("#" + targetId).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm',
        showButtonPanel: true,
        beforeShow: function (el, dp) {
            if ((selDate = $(this).val()).length > 0) {
                iYear = selDate.substring(0, 4);
                iMonth = selDate.substring(5, selDate.length + 1);
                $(this).datepicker('option', 'defaultDate', new Date(iYear, iMonth - 1, 1));
                $(this).datepicker('setDate', new Date(iYear, iMonth - 1, 1));
            } else {
                var dt = new Date();
                iYear = dt.getFullYear();
                iMonth = dt.getMonth();
                $(this).datepicker('option', 'defaultDate', new Date(iYear, iMonth, 1));
                $(this).datepicker('setDate', new Date(iYear, iMonth, 1));
            }
            $('#ui-datepicker-div').addClass('hide-calendar');
        },
        onClose: function (dateText, inst) {
            //  $('#ui-datepicker-div').removeClass('hide-calendar');
        },
    }).focus(function () {
        var thisCalendar = $(this);
        $('.ui-datepicker-calendar').detach();
        $('.ui-datepicker-close').click(function () {
            $('.ui-datepicker-calendar').hide();
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            thisCalendar.datepicker('setDate', new Date(year, month, 1));
        });
    });
}

function initDatePickerForROCDay(targetId) {
    $("#" + targetId).datepicker({ changeYear: true, changeMonth: true, currentText: "Now", dateFormat: "Rmmdd" });

    //先設定預設西元年的datepicker必要功能
    var old_generateMonthYearHeader = $.datepicker._generateMonthYearHeader;
    var old_formatDate = $.datepicker.formatDate;
    var old_parseDate = $.datepicker.parseDate;

    $.extend($.datepicker, {
        //選擇日期之後的value
        formatDate: function (format, date, settings) {
            var oformatDate = old_formatDate(format, date, settings);
            if (format == 'Rmmdd') {
                var d = date.getDate();
                var m = date.getMonth() + 1;
                var y = date.getFullYear();
                var fm = function (v) {
                    return (v < 10 ? '0' : '') + v;
                };

                if ((y - 1911) >= 100) { y = y - 1911; } else { y = "0" + String(y - 1911); }
                return (y) + '-' + fm(m) + '-' + fm(d);
            }
            return oformatDate;

        },
        //點取已存在日期的parse
        parseDate: function (format, value, settings) {
            var v = new String(value);
            var Y, M, D;
            if (format == 'Rmmdd') {
                if (v.length == 9) {/*100-12-15*/
                    Y = v.substring(0, 3) - 0 + 1911;
                    M = v.substring(4, 6) - 0 - 1;
                    D = v.substring(7, 9) - 0;
                    return (new Date(Y, M, D));
                } else if (v.length == 8) {/*098-12-15*/

                    Y = "0" + String(v.substring(0, 2) - 0 + 1911);
                    M = v.substring(3, 5) - 0 - 1;
                    D = v.substring(6, 8) - 0;
                    return (new Date(Y, M, D));
                }
                return (new Date());
            } else {
                var oparseDate = old_parseDate.apply(this, [format, value, settings]);
                return (oparseDate);
            }

        },
        //改變小工具的年
        _generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate, secondary, monthNames, monthNamesShort) {
            var dateFormat = this._get(inst, "dateFormat");
            var htmlYearMonth = old_generateMonthYearHeader.apply(this, [inst, drawMonth, drawYear, minDate, maxDate, secondary, monthNames, monthNamesShort]);
            if (dateFormat == 'Rmmdd') {
                if ($(htmlYearMonth).find(".ui-datepicker-year").length > 0) {
                    htmlYearMonth = $(htmlYearMonth).find(".ui-datepicker-year").find("option").each(function (i, e) {
                        console.log(e.textContent);
                        if (Number(e.value) - 1911 > 0) { $(e).text(Number(e.textContent) - 1911); }

                    }).end().end().get(0).outerHTML;
                }
            }
            return htmlYearMonth;
        }
    });

}


function getAwardItemOkMem(tableId) {
    var res = "";
    var tableId = "AwardItemTable";
    var tableTr = $('#' + tableId + ' tbody tr').each(function (index) {
        var myChkBox = $(this).find('td:first input:checkbox');
        if (myChkBox.is(":checked")) {
            var itemName = $(this).find("td").context.cells['3'].innerHTML;
            res = res + "[" + itemName + "]";
        }
    });
    return res;
}

function initCommonDialog(dialogDivId, titleName, dialogHeight, dialogWidth, submitText, submitFunction) {
    var $form = $("#" + dialogDivId).find("form");
    if (dialogWidth === null)
        dialogWidth = 600;
    if ((submitText === null) || (submitText === ''))
        submitText = "送出";
    var dialogButtons = {};
    dialogButtons[submitText] = submitFunction;
    dialogButtons["取消"] = function () {
        $("#" + dialogDivId).dialog("close");
    };
    var functions = {};
    functions["invokeSubmitFunction"] = submitFunction;
    $("#" + dialogDivId).dialog({
        title: titleName,
        autoOpen: false,
        height: dialogHeight,
        width: dialogWidth,
        modal: true,
        buttons: dialogButtons,
        close: function () {
            $form[0].reset();
        }
    });
    $form.on("submit", function (event) {
        event.preventDefault();
        if (typeof functions.invokeSubmitFunction === 'function') {
            functions.invokeSubmitFunction();
        }
    });
}
function commonSuccessAjaxHandle(obj, successMsg, dialogDivId, successFunction, failedFunction) {
    var $form = $("#" + dialogDivId).find("form");
    if ((successMsg === null) || (successMsg === ''))
        successMsg = "成功";
    var functions = {};
    functions["invokeSuccessFunction"] = successFunction;
    functions["invokeFailedFunction"] = failedFunction;
    if (obj["errorString"] === "") {
        showMsg(successMsg);
        $form[0].reset();
        $("#" + dialogDivId).dialog("close");
        if (typeof functions.invokeSuccessFunction === 'function') {
            functions.invokeSuccessFunction();
        }
    } else {
        showMsg(obj["errorString"]);
        if (typeof functions.invokeFailedFunction === 'function') {
            functions.invokeFailedFunction();
        }
    }
}

//限制只有最上層的 modal 的 scroll bar 有作用
$('.modal').on('hidden.bs.modal', function (e) {
    if ($('.modal').hasClass('in')) {
        $('body').addClass('modal-open');
    }
});

//取得今年民國年  
function getChineseYear() {
    var date = new Date();
    return date.getFullYear() - 1911;
}

// 字串左邊補0
function padLeft(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return padLeft("0" + str, lenght);
}

// 字串右邊補0
function padRight(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return padRight(str + "0", lenght);
}

function CheckDate(value) {
    //var strDate = document.getElementById("date_hour").value; 
    //var reg=/^(/d{4})(/d{2})(/d{2})$/;
    //if(!reg.test(strDate)){
    //    alert("日期格式不正确!/n正确格式为:20040101");
    //    return false;
    //}

    var d = new Date(value);
    var dStr = d.toDateString();
    if (dStr == 'Invalid Date') {
        alert("日期格式錯誤");
        return "";
    }

    var ss = value.split("/");
    var year = ss[0];
    var month = ss[1];
    var date = ss[2];
    //var year=strDate.substring(0,4);
    //var month=strDate.substring(4,6);
    //var date=strDate.substring(6,8);
    //alert(year+month+date);
    if (!checkYear(year)) { return false; }
    if (!checkMonth(month)) { return false; }
    if (!checkDate(year, month, date)) { return false; }
    return true;
}
function checkYear(year) {
    if (isNaN(parseInt(year))) {
        alert("年份輸入有誤,請重新输入!");
        return false;
    }
    if (year.length != 4) {
        alert("年份輸入有誤,請重新输入!");
        return false;
    }
    //var current_year = new Date().getFullYear();
    //if ((parseInt(year) < 1920) || (parseInt(year) > current_year)) {
    //    alert("年份應該在1920-" + current_year + "之間!");
    //    return false;
    //}

    return true;
}
function checkMonth(month) {
    if (isNaN(parseInt(month, 10))) { alert("月份輸入有誤,請重新输入!"); return false; }
    else if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
        alert("月份應該在1-12之間!");
        return false;
    }
    else return true;
}
function checkDate(year, month, date) {
    var daysOfMonth = CalDays(parseInt(year), parseInt(month));
    if (isNaN(parseInt(date))) { alert("日期輸入有誤,請重新输入!"); return false; }
    else if (parseInt(date) < 1 || parseInt(date) > daysOfMonth) { alert("日期應該在1-" + daysOfMonth + "之間!"); return false; }
    else return true;
}
function CalDays(year, month) {
    var date = new Date(year, month, 0);
    return date.getDate();
}
function isLeapYear(year) {
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) return true;
    else return false;
}

//開啟指定的交易(已開啟的交易會先關閉再打開)
function openTab(ProgramID, ProgramName, ProgramURL, Encrypt, NewWindow, Executable, NotifyID) {
    if (ProgramID.indexOf("FM") == 0) {
        ProgramID = "Yuanta_" + ProgramID;
    }
    var name = 'Iframe_' + ProgramID;
    var divTabs = $(window.frameElement).parent().parent().parent();
    var aliveIFrame = divTabs.find("iframe[id='" + name + "']");
    var aliveId = aliveIFrame.attr('id');
    if (aliveId != undefined) {
        var tbody = aliveIFrame.closest('tbody');
        var allBtn = tbody.find('td span[name="' + aliveId + '"]');
        allBtn.each(function () {
            if ($(this).hasClass('ui-icon-close')) {
                try {
                    $(this).trigger('click');
                } catch (E) { }
            }
        });
    }
    window.top.OpenApplTab(ProgramID, ProgramName, ProgramURL, Encrypt, NewWindow, Executable, NotifyID);
}

function chineseYear(value) {
    if (value == "")
        return "";

    var regex = /^[0-1]?\d{1,2}[/][0-1]\d[/][0-3]\d$/;
    if (regex.test(value))
        return value;

    alert('日期格式錯誤');

    return "";
}