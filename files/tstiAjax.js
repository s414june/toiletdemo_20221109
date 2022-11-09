
/********************
ajax呼叫模組(呼叫相同執行的webForm交易)
參數:ajaxMethod 呼叫執行的方法
參數:data 傳遞的資料內容
參數:successFunction 呼叫成功所需執行的動作 (允許null，則為不回呼)
參數:failFunction  呼叫失敗所需執行的動作 (允許null，系統自動跳出錯誤訊息)

範例 ajaxSend('updateData',$("#editForm").serialize(),sucess,null)

********************/

//另外製作一個AlertIcon，在斷網時顯示給使用者看
let AlertIcon = null;
window.addEventListener("load", () => {
    if (AlertIcon == null) {
        let Icon = CreateAlertIcon();
        document.querySelector("body").appendChild(Icon);
    }
    AlertIcon = document.querySelector("#AlertIcon");
    AlertIcon.style.display = "none";
})

function ajaxSend(ajaxMethod, data, successFunction, failFunction, async) {
    if (async == undefined || async == null)
        async = false;

    var url = _basePath + '?ajaxMethod=' + ajaxMethod;
    if (ajaxMethod.indexOf('/') >= 0)
        url = ajaxMethod;
    $.ajax({
        async: async,
        url: url,
        data: data,
        type: 'POST',
        error: function (xhr, ajaxOptions, thrownError) {
            if (failFunction == undefined || failFunction == null) {
                //在斷網時顯示給使用者看AlertIcon
                if (AlertIcon != null)
                    AlertIcon.style.display = "block";
                //保留報錯訊息於主控台
                console.log('網路傳輸發生異常，訊息碼：' + xhr.status + '，訊息：' + xhr.responseText);
            } else {
                failFunction(xhr, ajaxOptions, thrownError);
            }
        },
        success: function (sdata) {
            if (successFunction != undefined && successFunction != null) {
                if (AlertIcon != null)
                    AlertIcon.style.display = "none";
                var obj = null;
                try {
                    var obj = jQuery.parseJSON(sdata);
                    if (obj['_OPType'] == 'TO_LOGIN') {
                        alert('閒置太久，請重新登入系統!!');
                        window.location = obj['_OPFail'];
                    }
                    if (obj['_OPType'] == 'ERROR') {
                        alert(obj['_OPFail']);
                    }

                } catch (e) {
                }
                if (obj == null)
                    successFunction(sdata);
                else
                    successFunction(obj);
            }
        }
    });
}



/********************
使用非同步傳輸
ajax呼叫模組(呼叫相同執行的webForm交易)
參數:ajaxMethod 呼叫執行的方法
參數:data 傳遞的資料內容
參數:successFunction 呼叫成功所需執行的動作 (允許null，則為不回呼)
參數:failFunction  呼叫失敗所需執行的動作 (允許null，系統自動跳出錯誤訊息)

範例 ajaxSend_ByAsyncIsTrue('updateData',$("#editForm").serialize(),sucess,null)

********************/
function ajaxSend_ByAsyncIsTrue(ajaxMethod, data, successFunction, failFunction) {

    $.ajax({
        async: true,
        url: _basePath + '?ajaxMethod=' + ajaxMethod,
        data: data,
        type: 'POST',
        error: function (xhr, ajaxOptions, thrownError) {
            if (failFunction == undefined || failFunction == null) {
                showMsg('網路傳輸發生異常，訊息碼：' + xhr.status + '，訊息：' + xhr.responseText);
            } else {
                failFunction(xhr, ajaxOptions, thrownError);
            }
        },
        success: function (sdata) {
            if (successFunction != undefined && successFunction != null) {
                var obj = null;
                try {
                    var obj = jQuery.parseJSON(sdata);
                    if (obj['_OPType'] == 'TO_LOGIN') {
                        alert('閒置太久，請重新登入系統!!');
                        window.location = obj['_OPFail'];
                    }
                    if (obj['_OPType'] == 'ERROR') {
                        alert(obj['_OPFail']);
                    }

                } catch (e) {
                }
                if (obj == null)
                    successFunction(sdata);
                else
                    successFunction(obj);
            }
        }
    });
}



function ajaxFastQuery(ajaxMethod, data, path) {
    var res = "";
    if (path == undefined || path == null || path.length == 0)
        path = _basePath;

    $.ajax({
        async: false,
        url: path + '?ajaxMethod=' + ajaxMethod,
        data: data,
        type: 'POST',
        error: function (xhr, ajaxOptions, thrownError) {
            showMsg('網路傳輸發生異常，訊息碼：' + xhr.status + '，訊息：' + xhr.responseText);
        },
        success: function (sdata) {
            var obj = null;
            try {
                var obj = jQuery.parseJSON(sdata);
                if (obj['_OPType'] == 'TO_LOGIN') {
                    alert('閒置太久，請重新登入系統!!');
                    window.location = obj['_OPFail'];
                }
                if (obj['_OPType'] == 'ERROR') {
                    alert(obj['_OPFail']);
                }

            } catch (e) {
            }
            res = obj['data'];
        }
    });
    return res;
}

/********************
ajax呼叫模組(呼叫相同執行的webForm交易)
參數:ajaxMethod 呼叫執行的方法
參數:fileField 上傳的檔案欄位id名稱
參數:data 傳遞的資料內容
參數:successFunction 呼叫成功所需執行的動作 (允許null，則為不回呼)
參數:failFunction  呼叫失敗所需執行的動作 (允許null，系統自動跳出錯誤訊息)

範例 ajaxSend('updateData',$("#editForm").serialize(),sucess,null)

********************/
function ajaxSendFile(ajaxMethod, fileField, data, successFunction, failFunction) {
    $.ajaxFileUpload
        (
        {
            url: _basePath + '?ajaxMethod=' + ajaxMethod,
            dataType: 'HTML',
            secureuri: false,
            fileElementId: fileField,
            data: data,
            success: function (sdata, status) {
                var input = $("#" + fileField).parents('.input-group').find(':text');
                if (input)
                    input.val("");
                if (successFunction != undefined && successFunction != null) {
                    try {
                        var obj = null;
                        if (true) {
                            var decode = decodeURI(sdata);
                            obj = jQuery.parseJSON(decode);
                        } else {
                            obj = jQuery.parseJSON(sdata);
                        }
                        successFunction(obj);
                    } catch (e) {
                        alert(e);
                        successFunction(sdata);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (failFunction == undefined || failFunction == null) {
                    showMsg('網路傳輸發生異常，訊息碼：' + xhr.status + '，訊息：' + xhr.responseText);
                } else {
                    failFunction(xhr, ajaxOptions, thrownError);
                }
            }
        }
        )

}
//初始化 select 標籤內容
//selectName: select 標籤的 name 屬性 (非ID)
//methodName: 取得 select 各選項的 method 名稱, 該method應回傳 id (用於 option 中的 value屬性)與 text (用於 option 的顯示文字)
//appendEmpty: 是否須建立空白選項
function initSelect(selectName, methodName, appendEmpty, afterFunction) {
    if (appendEmpty !== true)
        appendEmpty = false;
    var functions = {};
    functions["afterFunction"] = afterFunction;
    $.ajax({
        url: _basePath + '?ajaxMethod=' + methodName,
        type: 'POST',
        dataType: 'JSON',
        error: function (xhr, ajaxOptions, thrownError) {
            showMsg('網路傳輸發生異常，訊息碼：' + xhr.status + '，訊息：' + xhr.responseText);
        },
        success: function (sdata) {
            try {
                if (sdata["errorString"] != "")
                    showMsg(sdata["errorString"]);
                else {
                    var $select = $("select[name=" + selectName + "]");
                    $select.find('option').remove();
                    if (appendEmpty)
                        $select.append($('<option>').text("").attr('value', ""));
                    var data = $.parseJSON(sdata["data"]);
                    try {
                        $.each(data, function (i, item) {
                            $select.append($('<option>').text(item.text).attr('value', item.id));
                        });
                    } catch (e) {
                        console.log("無法正確將 option 填入 select 標籤。例外訊息為" + e);
                        console.log(data);
                    }
                    if (typeof functions.afterFunction === 'function') {
                        functions.afterFunction(data);
                    }
                }
            } catch (e) {
                showMsg(e);
            }
        }
    });
}
//初始化 select 標籤內容
//selectName: select 標籤的 id 屬性
//methodName: 取得 select 各選項的 method 名稱, 該method應回傳 id (用於 option 中的 value屬性)與 text (用於 option 的顯示文字)
//appendEmpty: 是否須建立空白選項
function initSelectById(selectId, methodName, appendEmpty, afterFunction) {
    if (appendEmpty !== true)
        appendEmpty = false;
    var functions = {};
    functions["afterFunction"] = afterFunction;
    var $form = $("#" + selectId).closest("form");
    $.ajax({
        url: _basePath + '?ajaxMethod=' + methodName + "&" + $form.serialize(),
        type: 'POST',
        dataType: 'JSON',
        error: function (xhr, ajaxOptions, thrownError) {
            showMsg('網路傳輸發生異常，訊息碼：' + xhr.status + '，訊息：' + xhr.responseText);
        },
        success: function (sdata) {
            try {
                if (sdata["errorString"] != "")
                    showMsg(sdata["errorString"]);
                else {
                    var $select = $("#" + selectId);
                    $select.find('option').remove();
                    if (appendEmpty)
                        $select.append($('<option>').text("全選").attr('value', ""));
                    var data = $.parseJSON(sdata["data"]);
                    try {
                        $.each(data, function (i, item) {
                            $select.append($('<option>').text(item.text).attr('value', item.id));
                        });
                    } catch (e) {
                        console.log("無法正確將 option 填入 select 標籤。例外訊息為" + e);
                        console.log(data);
                    }
                    if (typeof functions.afterFunction === 'function') {
                        functions.afterFunction(data);
                    }
                }
            } catch (e) {
                showMsg(e);
            }
        }
    });
}


function doIfNoError(obj, myfun) {
    try {
        var functions = {};
        functions["myfun"] = myfun;
        var errString = obj["errorString"];
        if ((errString !== undefined) && (errString !== "")) {
            showMsg(errString);
        } else {
            if (typeof functions.myfun === 'function') {
                functions.myfun(obj);
            }
        }
    } catch (ex) {
        showMsg(ex);
    }

}

//繪製AlertIcon(在斷網時顯示給使用者看的圖示，位於右上角)
function CreateAlertIcon() {
    var xmlns = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(xmlns, "svg");
    svg.setAttributeNS(null, "viewBox", "0 0 862.9 862.9");
    svg.setAttributeNS(null, "fill", "#fff");
    svg.style = "position: fixed;width: 45px;height: 45px;right: 0;top: 0;opacity: 0.5;padding: 8px;margin:5px;z-index: 500000000;display:block;background:#219298;border-radius:10px;";
    svg.id = "AlertIcon";
    let path1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    let path2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    let circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );
    let polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
    );
    path1.setAttributeNS(null, "d", "M561.7,401c-15.801-10.3-32.601-19.2-50.2-26.6c-39.9-16.9-82.3-25.5-126-25.5c-44.601,0-87.9,8.9-128.6,26.6c-39.3,17-74.3,41.3-104.1,72.2L253.5,545c34.899-36.1,81.8-56,132-56c49,0,95.1,19.1,129.8,53.8l25.4-25.399L493,469.7L561.7,401z");
    svg.appendChild(path1);
    path2.setAttributeNS(null, "d", "M385.6,267.1c107.601,0,208.9,41.7,285.3,117.4l98.5-99.5c-50-49.5-108.1-88.4-172.699-115.6c-66.9-28.1-138-42.4-211.101-42.4c-73.6,0-145,14.4-212.3,42.9c-65,27.5-123.3,66.8-173.3,116.9l99,99C175.5,309.299,277.3,267.1,385.6,267.1z");
    svg.appendChild(path2);
    circle.setAttributeNS(null, "cx", "385.6");
    circle.setAttributeNS(null, "cy", "656.1");
    circle.setAttributeNS(null, "r", "79.8");
    svg.appendChild(circle);
    polygon.setAttributeNS(null, "points", "616.8,402.5 549.7,469.599 639.2,559.099 549.7,648.599 616.8,715.7 706.3,626.2 795.8,715.7 862.899,648.599 773.399,559.099 862.899,469.599 795.8,402.5 706.3,492");
    svg.appendChild(polygon);

    return svg;
}