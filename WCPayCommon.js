// //重写alert，标题不展示域名
(function () {
    window.alert = function (name) {
        var iframe = document.createElement("IFRAME");
        iframe.style.display = "none";
        iframe.setAttribute("src", 'data:text/plain');
        document.documentElement.appendChild(iframe);
        window.frames[0].window.alert(name);
        iframe.parentNode.removeChild(iframe);
    }
})();
/**
 * 字符串格式化，用于在模板中注入值
 * 例：var s = "id={id}".formatString(obj);
 * @param obj 对象
 * @returns {string} 注入后的字符串
 */
String.prototype.format = function (obj) {
    var reg = /{([^{}]+)}/gm;
    return this.replace(reg, function (match, name) {
        return obj[name];
    });
};

function Hj() {
}

Hj.BASE_URL = {
    PROPERTY: "/nolog/property"
};
Hj.getHtmlTemplate = function (id) {
    return $("#" + id).html();
};
Hj.getUrlParam = function (key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
};
Hj.defPost = function (url, data, handler, headers, callback) {
    Hj.post(url, data, handler, null, null, headers, callback);
};
Hj.post = function (url, data, handler, contentType, dataType, headers, callback) {
    if (!window.navigator.onLine) {
        alert("当前处于离线状态，请检查网络！");
        return;
    }
    if (contentType && contentType.indexOf('application/json') > -1) {
        data = typeof data == 'object' ? JSON.stringify(data) : data;
    }
    return $.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: defaultHandler(handler),
        contentType: contentType ? contentType : 'application/x-www-form-urlencoded;charset=UTF-8',
        dataType: dataType ? dataType : 'json',
        beforeSend: function (request) {
            if (headers && headers.length > 0) {
                headers.forEach(function (header) {
                    request.setRequestHeader(header.name, header.value);
                });
            }
        }
    });

    function defaultHandler(handler) {

        return func;

        function func(data, textStatus, jqXHR) {
            if (data.code !== 200) {
                if (callback) {
                    callback(data, textStatus, jqXHR);
                    return;
                }
                alert(data.message);
                return;
            }
            handler(data, textStatus, jqXHR);
        }
    }
};
Hj.getDefaultHeader = function () {
    var key = Hj.getUrlParam('key');
    if (!key) {
        throw "参数[key]错误！";
    }
    return [{name: 'clientKey', value: key}]
};
Hj.buildUrlWithParam = function (opt, delKey) {
    var url = opt.url;
    var paramList = opt.paramList || [];
    paramList.push(getParam('random', Math.random().toFixed(5) * 1000000));
    if (!delKey) {
        paramList.push({
            name: 'key',
            value: Hj.getUrlParam('key')
        });
    }
    var param = "?";
    var join = paramList.map(function (d) {
        return d.name + '=' + d.value + '&';
    }).join('');
    param += join.substring(0, join.length - 1);
    return encodeURI(url + param);

    function getParam(key, value) {
        return {
            name: key,
            value: value
        }
    }
};
Hj.getYearList = function () {
    var now = new Date();
    var year = now.getFullYear();
    var list = [];
    for (var i = 0; i < 5; i++) {
        var theYear = year + i;
        list.push({
            name: theYear + '',
            value: theYear
        });
    }
    return list;
};
Hj.redirect = function (url) {
    if (!window.navigator.onLine) {
        alert("当前处于离线状态，请检查网络！");
        return;
    }
    window.location.href = url;
};
//判断当前时间是否为每年的最后两天，修复年底时默认展示第二年
Hj.isYearLastTwoDay = function () {
    var currentDate = new Date();
    return currentDate.getMonth() + 1 == 12 && currentDate.getDate() >= 30;
};