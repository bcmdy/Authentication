// 定义包名
const packagename = "com.bcmdy.test";
// 加密密钥
const RC4_key = 'encode_key_bcmdy_authentication';
// 是否伪造 android_id
let fake_android_id = true;
// 设备id
let android_id = false;
// 用户到期时间
let user_time = 0;
// 是否为vip
let isvip = false;

let Secure = Java.use("android.provider.Settings$Secure");
Secure.getString.implementation = function (arg1, arg2) {
    var temp = this.getString(arg1, arg2);
    if (arg2.indexOf("android_id") < 0)
        return temp;
    android_id = CryptoJS.MD5('Salted_bcmdy_encode' + temp + 'Salted_bcmdy_encode');
    if (fake_android_id)
        return CryptoJS.MD5('Salted_bcmdy_encode' + temp + 'Salted_bcmdy_encode' + Date.now());
}

/**
 * 将时间戳转换为GMT格式。
 * @param {number} timestamp - 要转换的时间戳。
 * @returns {string} - GMT格式的时间戳。
 */
function timestamptoGMT(timestamp) {
    // 从时间戳创建一个新的Date对象
    const date = new Date(parseInt(timestamp));

    // 从日期对象中获取年份、月份、日期、小时、分钟和秒钟
    const Year = date.getFullYear().toString().padStart(4, '0');
    const Month = (date.getMonth() + 1).toString().padStart(2, '0');
    const Day = date.getDate().toString().padStart(2, '0');
    const Hour = date.getHours().toString().padStart(2, '0');
    const Minute = date.getMinutes().toString().padStart(2, '0');
    const Second = date.getSeconds().toString().padStart(2, '0');

    // 将日期组件格式化为GMT格式
    const GMT = `${Year}-${Month}-${Day} ${Hour}:${Minute}:${Second}`;

    // 返回GMT格式化的时间戳
    return GMT;
}

/**
 * 根据提供的结果对用户进行身份验证。
 * @param {string} result - 要进行身份验证的结果。
 */
function Authentication(result) {

    // 使用 RC4 加密解密结果，并将其转换为 Utf8 字符串
    const userdata = CryptoJS.RC4.decrypt(result.toString(), RC4_key).toString(CryptoJS.enc.Utf8);

    // 将解密后的 userdata 解析为 JSON
    const parsedData = JSON.parse(userdata);

    // 初始化设备错误和到期错误标志
    let device_error = true;
    let expire_error = true;

    // 遍历解析后的数据
    parsedData.forEach(element => {
        // 检查设备 id 是否与元素的设备 id 匹配
        if (android_id == element.device_id) {
            device_error = false;
            user_time = element.expiretime;
            // 检查当前时间是否小于元素的到期时间
            if (Date.now() < element.expiretime) {
                expire_error = false;
                isvip = true;
                console.log('身份验证成功，启动脚本~');
                toast('身份验证成功，启动脚本~');
                main();
                // 设置一个延迟，3 秒后显示到期时间
                setTimeout(() => {
                    console.log('到期时间: ' + timestamptoGMT(element.expiretime));
                    toast('到期时间: ' + timestamptoGMT(element.expiretime));
                }, 3000);
            }
        }
    });

    // 处理设备错误
    if (device_error) {
        console.log('设备验证失败！');
        console.log('设备 id: ' + android_id);
        toast('正在启动基础脚本~');
        console.log('正在启动基础脚本~');
        main();
    }
    // 处理到期错误
    else if (expire_error) {
        console.log('到期时间: ' + timestamptoGMT(user_time));
        console.log('用户已到期！');
        console.log('设备 id: ' + android_id);
        toast('正在启动基础脚本~');
        console.log('正在启动基础脚本~');
        main();
    }
}


/**
 * 获取 URL 并验证文件
 */
function gourl() {
    // 定义 URL 和备用 URL 列表
    const url = `https://raw.githubusercontent.com/bcmdy/Authentication/main/${packagename}.json`;
    const arrurl = [
        url,
        `https://gh-proxy.com/${url}`,// 韩国
        `https://ghproxy.net/${url}`,// 日本
        `https://github.moeyy.xyz/${url}`,// 其他(新加坡、香港、日本)
        `https://raw.fgit.cf/bcmdy/Authentication/main/${packagename}.json`,// 美国
    ];

    // 随机选择一个 URL 进行请求
    const random = Math.floor(Math.random() * arrurl.length);

    // 发起 HTTP 请求，并处理结果
    http.get(arrurl[random], {}, {
        success: function (result) {
            Authentication(result);
        },
        error: function (err) {
            console.log('服务器访问失败，尝试其他线路···');
            gourl();
        }
    });
}







// 验证循环
var getDeviceid = setInterval(function () {
    if (android_id != false) {
        clearInterval(getDeviceid);
        if (runtime.packageName == packagename) {
            gourl();
        } else {
            toast('目标错误，此脚本并不适用于此应用！');
            console.log('目标错误，此脚本并不适用于此应用！');
        }

    }
}, 100)

function main() {
    const Mod = {
        name: "test",
        version: "1.0.0",
        _功能1: {
            xx: true,
            yy: true,
            zz: false
        },
        _vip功能: {
            aa: false,
            bb: false,
            cc: false
        }
    }

    let menu = [{
        'type': 'tab',
        'title': '功能1',
        'item': [
            { 'type': 'category', 'title': '功能1' },
            { 'id': 'xx', 'type': 'switch', 'title': 'xx', 'enable': Mod._功能1.xx },
            { 'id': 'yy', 'type': 'switch', 'title': 'yy', 'enable': Mod._功能1.yy },
            { 'id': 'zz', 'type': 'switch', 'title': 'zz', 'enable': Mod._功能1.zz }
        ],
        enable: true
    }];
    if (isvip) {
        Mod._vip功能.aa = true;
        Mod._vip功能.bb = true;
        Mod._vip功能.cc = true;
        const vip = {
            'type': 'tab',
            'title': 'vip功能',
            'item': [
                { 'type': 'category', 'title': 'vip功能' },
                { 'id': 'aa', 'type': 'switch', 'title': 'aa', 'enable': Mod._vip功能.aa },
                { 'id': 'bb', 'type': 'switch', 'title': 'bb', 'enable': Mod._vip功能.bb },
                { 'id': 'cc', 'type': 'switch', 'title': 'cc', 'enable': Mod._vip功能.cc }
            ],
            enable: false
        }
        menu.push(vip);
    }
    modmenu.create(Mod.name,
        menu
        , {
            onchange: function (data) {
                //注意在这里需要进行一下转换
                data = JSON.parse(data);
                switch (data.id) {
                    case 'xx':
                        Mod._功能1.xx = data.val;
                        xx(Mod._功能1.xx);
                        break;
                    case 'yy':
                        Mod._功能1.yy = data.val;
                        yy(Mod._功能1.yy);
                        break;
                    case 'zz':
                        Mod._材料1.zz = data.val;
                        zz(Mod._功能1.zz);
                        break;
                    case 'aa':
                        Mod._vip功能.aa = data.val;
                        aa(Mod._功能1.aa);
                        break;
                    case 'bb':
                        Mod._vip功能.bb = data.val;
                        bb(Mod._功能1.bb);
                        break;
                    case 'cc':
                        Mod._vip功能.cc = data.val;
                        cc(Mod._功能1.cc);
                        break;
                    default:
                        toast("未设定CallBack");
                }
            }
        })
    function xx(xx) {
        console.log(xx);
    }
    function yy(yy) {
        console.log(yy);
    }
    function zz(zz) {
        console.log(zz);
    }
    function aa(aa) {
        console.log(aa);
    }
    function bb(bb) {
        console.log(bb);
    }
    function cc(cc) {
        console.log(cc);
    }
}