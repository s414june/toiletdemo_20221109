//
$.fn.checkFormDataStr = function (obj) {
    var json = this.checkFormDataJSon();
    var resString = "";
    if (json.length > 0) {
        if (obj != null) {
            for (var i = 0; i < json.length; i++) {
                resString += obj + json[i] + "\r\n";
            }
        }
        else
        {
            for (var i = 0; i < json.length; i++) {
                resString += json[i] + "\r\n";
            }
        }

    }
    return resString;
}
/********
  欄位檢核:
     設定方法:
       1.需在html中定義 desc欄位，以提供該欄位中文描述   
       2.在html設定class設定:  
             v_maxLength_10:表示該欄位最大長度為10      
             v_maxCLength_10:表示該欄位最大長度為10(中文長度算2)
             v_required: 表示該欄位必輸入
             v_dateOverToday: 日期需大於系統日期
             v_dateSmallToday: 日期需小於系統日期
             v_Email: 檢核Email格式
             v_date: 檢核日期格式
             v_cdate: 檢核民國日期格式
             v_number: 請輸入正確的數值
             v_digits:只可輸入數字
             v_cellPhone : 行動電話檢核(09XX-XXXXXX)
             v_phone : 室內電話檢核(0X-XXXXXXXX)
             v_fax : 傳真號碼檢核(0XXXXXXXXX)
             v_phoneOrCellPhone : 室內電話(0X-XXXXXXXX)/行動電話檢核(09XX-XXXXXX)
             v_dateRange_DateStartField: DateStartField為起始日期的id 檢核該日期欄位日期不可大於DateStartField
             v_cdateRange_DateStartField: DateStartField為起始日期的id 檢核該日期欄位日期不可大於DateStartField(民國年)
             v_specifiedChars : 表示該欄位不可輸入特殊字元(目前指定義"<", ">" , "/" , "\")
*********/
$.fn.checkFormDataJSon = function () {
    var jsonObj = [];
    var resString = "";
    var findKey;

    try {
        findKey = 'v_required';
        this.find('.' + findKey).each(function () {
            var val = '';
            if ($(this).prop("tagName") == "SELECT") {
                val = $(this).val() == null ? "" : $(this).val();
            }
            else
                val = $(this).val().trim();
            if (val.length == 0) {
                //jsonObj.push("'" + $(this).getFieldName() + "'欄位必須輸入!!");
                jsonObj.push("'" + $(this).getFieldName() + "'!!");
            }
        });

        findKey = 'v_maxLength_';
        this.find('[class*=' + findKey + ']').each(function () {
            var allClass = $(this).attr('class').split(" ");
            for (var i = 0; i < allClass.length ; i++) {
                if (allClass[i].indexOf(findKey) == 0) {
                    var num = allClass[i].substring(findKey.length);
                    var val = $(this).val().trim();
                    if (val.length > parseInt(num))
                        jsonObj.push("'" + $(this).getFieldName() + "'欄位長度不可大於" + num + "!!");
                }
            }
        });

        findKey = 'v_maxCLength_';
        this.find('[class*=' + findKey + ']').each(function () {
            var allClass = $(this).attr('class').split(" ");
            for (var i = 0; i < allClass.length ; i++) {
                if (allClass[i].indexOf(findKey) == 0) {
                    var num = allClass[i].substring(findKey.length);
                    var val = $(this).val().trim();
                    if (v_getStringByteLen(val) > parseInt(num))
                        jsonObj.push("'" + $(this).getFieldName() + "'欄位長度不可大於" + num + "!!");
                }
            }
        });

        findKey = 'v_dateRange_';
        this.find('[class*=' + findKey + ']').each(function () {
            var allClass = $(this).attr('class').split(" ");
            for (var i = 0 ; i < allClass.length ; i++) {
                if (allClass[i].indexOf(findKey) == 0) {
                    var val = $(this).val().trim();
                    var startField = $('#' + allClass[i].substring(findKey.length).trim());
                    var startVal = startField.val().trim();
                    if (startVal.length > 0 && v_checkDate(startVal) && val.length > 0 && v_checkDate(val)) {
                        var d1 = new Date(startVal);
                        var d2 = new Date(val);
                        if (d1.getTime() > d2.getTime()) {
                            jsonObj.push("'" + $(this).getFieldName() + "'日期不可小於'" + startField.getFieldName() + "'欄位");
                        }
                    }
                }
            }
        });

        findKey = 'v_cdateRange_';
        this.find('[class*=' + findKey + ']').each(function () {
            var allClass = $(this).attr('class').split(" ");
            for (var i = 0; i < allClass.length ; i++) {
                if (allClass[i].indexOf(findKey) == 0) {
                    var val = $(this).val().trim();
                    var startField = $('#' + allClass[i].substring(findKey.length).trim());
                    var startVal = startField.val().trim();
                    if (startVal.length > 0 && v_checkROCDate(startVal) && val.length > 0 && v_checkROCDate(val)) {
                        var d1 = new Date(startVal);
                        var d2 = new Date(val);
                        if (d1.getTime() > d2.getTime()) {
                            jsonObj.push("'" + $(this).getFieldName() + "'日期不可小於'" + startField.getFieldName() + "'欄位");
                        }
                    }
                }
            }
        });

        findKey = 'v_Email';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            if (val.length > 0 && !v_checkEmail(val)) {
                jsonObj.push("'" + $(this).getFieldName() + "'欄位為非有效的EMail信箱!!");
            }
        });

        findKey = 'v_date';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            if (val.length > 0 && !v_checkDate(val)) {
                jsonObj.push("'" + $(this).getFieldName() + "'欄位為非有效的日期格式!!");
            }
            //if (val.length > 0 && !checkDateRight(val)) {
            //    jsonObj.push("'" + $(this).getFieldName() + "'欄位為日期輸入不正確!");
            //}
        });

        findKey = 'v_dateOverToday';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            var dtToday = new Date();
            var mydate = new Date(val);
            if (mydate <= dtToday) {
                jsonObj.push("'" + $(this).getFieldName() + "'日期必需要大於今天!!");
            }
        });
        findKey = 'v_dateSmallToday';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            var dtToday = new Date();
            var mydate = new Date(val);
            if (mydate > dtToday) {
                jsonObj.push("'" + $(this).getFieldName() + "'日期必需要小於今天!!");
            }
        });

        findKey = 'v_dateYM';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            if (val.length > 0 && !checkDateYMRight(val)) {
                jsonObj.push("'" + $(this).getFieldName() + "'欄位為日期輸入不正確!!");
            }
        });

        findKey = 'v_cdate';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            if (val.length > 0 && !v_checkROCDate(val)) {
                jsonObj.push("'" + $(this).getFieldName() + "'欄位為非有效的民國日期格式!!");
            }
        });

        findKey = 'v_number';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            if (val.length > 0 && !v_checkNumber(val)) {
                jsonObj.push("'" + $(this).getFieldName() + "'欄位為非有效的數值格式!!");
            }
        });


        findKey = 'v_digits';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            if (val.length > 0 && !v_checkDigit(val)) {
                jsonObj.push("'" + $(this).getFieldName() + "'欄位為非有效的數字格式!!");
            }
        });


        findKey = 'v_phone';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            var re = /^[0]{1}[0-9]{1}-[0-9]{6,8}$/;
            var dtArray = val.match(re);
            if (val.length > 0) {
                if (dtArray == null)
                    jsonObj.push("'" + $(this).getFieldName() + "'欄位為非有效的電話格式!!");
            }
        });

        findKey = 'v_phoneOrCellPhone';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            if (val.length > 0) { 
                var chkRes = v_phoneOrCellPhoneChk(val);
                if (!chkRes)
                    jsonObj.push("'" + $(this).getFieldName() + "'欄位為非有效的電話格式!!");
            }
        });

        findKey = 'v_cellPhone';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            if (val.length > 0) {
                var chkRes = v_cellPhoneChk(val);
                if (!chkRes)
                    jsonObj.push("'" + $(this).getFieldName() + "'欄位為非有效的行動電話格式!!");
            }
        });

        findKey = 'v_fax';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            var re = /^[0]{1}[0-9]{1}[0-9]{6,8}$/;
            var dtArray = val.match(re);
            if (val.length > 0) {
                if (dtArray == null)
                    jsonObj.push("'" + $(this).getFieldName() + "'欄位為非有效的傳真格式!!");
            }
        });

        findKey = 'v_specifiedChars';
        this.find('.' + findKey).each(function () {
            var val = $(this).val().trim();
            var re = /[^<>/\\]/;
            //[^%!&+'"?<>/\\]
            //var re = /[\w]/;
            var chars = val.split('');
            for (var i = 0; i < chars.length; i++) {
                var dtArray = chars[i].match(re);
                if (chars[i].length > 0) {
                    if (dtArray == null) {
                        jsonObj.push("'" + $(this).getFieldName() + "'欄位不可輸入特殊字元!!");
                        return;
                    }
                }
            }
        });
    } catch (e) {
        throw e;
    }
    return jsonObj;
};

//取得欄位名稱(沒欄位名稱的話，回傳ID )
$.fn.getFieldName = function () {
    var desc = this.attr('desc');
    if (desc == undefined || desc.trim() == '')
        desc = this.attr('id');
    return desc;
}

//檢查是否為電話格式
function v_phoneOrCellPhoneChk(indata) {

    //0911-123123
    var re1 =  /^[09]{2}[0-9]{2}-[0-9]{6}$/;
    var re1Ans = indata.match(re1);
    if(re1Ans != null)
        return true;
    //02-22224444
    var re2 = /^[0]{1}[0-9]{1}-[0-9]{6,8}$/;
    var re2Ans = indata.match(re2);
    if (re2Ans != null)
        return true;
    //0911-123-123
    var re3 = /^[09]{2}[0-9]{2}-[0-9]{3}-[0-9]{3}$/;
    var re3Ans = indata.match(re3);
    if (re3Ans != null)
        return true;

    //0911123123
    var re4 = /^[09]{2}[0-9]{2}[0-9]{3}[0-9]{3}$/;
    var re4Ans = indata.match(re4);
    if (re4Ans != null)
        return true;

    //02-2222-4444
    var re5 = /^[0]{1}[0-9]{1}-[0-9]{3,4}-[0-9]{3,4}$/;
    var re5Ans = indata.match(re5);
    if (re5Ans != null)
        return true;
    return false;
}

//檢查行動電話格式
function v_cellPhoneChk(indata) {
    //0911-123123
    var re1 = /^[09]{2}[0-9]{2}-[0-9]{6}$/;
    var re1Ans = indata.match(re1);
    if (re1Ans != null)
        return true;
    //0911-123-123
    var re3 = /^[09]{2}[0-9]{2}-[0-9]{3}-[0-9]{3}$/;
    var re3Ans = indata.match(re3);
    if (re3Ans != null)
        return true;

    //0911123123
    var re4 = /^[09]{2}[0-9]{2}[0-9]{3}[0-9]{3}$/;
    var re4Ans = indata.match(re4);
    if (re4Ans != null)
        return true;
    return false;
}

//取得字串長度
function v_getStringByteLen(c) {
    var n = c.length, s;
    var len = 0;
    for (var i = 0; i < n; i++) {
        s = c.charCodeAt(i);
        while (s > 0) {
            len++;
            s = s >> 8;
        }
    }
    return len;
}


//檢查EMail格式
function v_checkEmail(email) {
    var reg = /^[^\s]+@[^\s]+\.[^\s]{2,3}$/;
    if (reg.test(email)) {
        return true;
    } else {
        return false;
    }
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

//檢查是否為民國日期格式
function v_checkROCDate(txtDate) {
    var currVal = $.trim(txtDate);
    if (currVal == '')
        return false;

    //Declare Regex  
    var rxDatePattern = /^(\d{3})(-)(\d{1,2})(-)(\d{1,2})$/;
    var dtArray = currVal.match(rxDatePattern);
    if (dtArray == null)
        return false;
    var year = parseInt(txtDate.substring(0, 3)) + 1911;
    return v_checkDate(year + txtDate.substring(3));

}

//檢查西元日期正確性(含閏年)
function v_checkDate(dateString) {
    var regForDate = /^((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))$/;
    return regForDate.test(dateString);
}

//檢查西元年月正確性  yyyy/MM
function checkDateYMRight(dateString) {
    var regForDate = /^((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])((1[0-2])|(0[1-9]))$))$/;
    return regForDate.test(dateString);
}

// 檢查檔案大小
function checkFileSize(filePath) {
    var jsonObj = [];
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    if ((fso.GetFile(filePath).size / 1024 / 1024) > 10) {
        jsonObj.push("上傳檔案超過10MB，請重新上傳!!");
    }
    return jsonObj;
}

//檢查特殊字元
function v_specifiedChars(dateString) {
    var val = dateString.trim();
    var re = /[^<>]/;
    //var re = /[\w]/;
    var chars = val.split('');
    for (var i = 0; i < chars.length; i++) {
        var dtArray = chars[i].match(re);
        if (chars[i].length > 0) {
            if (dtArray == null) {                
                return false;
            }
        }
    }
    return true;
}


