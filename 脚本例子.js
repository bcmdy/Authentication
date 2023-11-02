var android_id, fake_android_id = true;
var Secure = Java.use("android.provider.Settings$Secure");
Secure.getString.implementation = function (arg1, arg2) {
    var temp = this.getString(arg1, arg2);
    if (arg2.indexOf("android_id") < 0)
        return temp;
    android_id = CryptoJS.MD5('Salted_bcmdy_encode' + temp + 'Salted_bcmdy_encode');
    if (fake_android_id)
        return CryptoJS.MD5('Salted_bcmdy_encode' + temp + 'Salted_bcmdy_encode' + Date.now());
}
// 时间戳转换
function timestamptoGMT(timestamp) {
    let date = new Date(parseInt(timestamp));
    let Year = date.getFullYear();
    let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    let GMT = Year + '-' + Moth + '-' + Day + '   ' + Hour + ':' + Minute + ':' + Sechond;
    // console.log(GMT)  // 2022-09-07 15:56:07 
    // let GMT = date.toLocaleString('zh-CN');
    // console.log(GMT)  // 2023/10/29 00:13:42
    return (GMT);
}
// 验证入口
function Authentication(result) {
    // 到期
    var expire_error = true;
    // 未授权设备
    var device_error = true;
    try {
        var key = '';
        var userdata = CryptoJS.RC4.decrypt(result.toString(), key).toString(CryptoJS.enc.Utf8);
        // console.log(userdata);
        var userdata = JSON.parse(userdata);
        userdata.forEach(element => {
            if (android_id == element.device_id) {
                device_error = false;
                user_time = element.expiretime;
                if (Date.now() < element.expiretime) {
                    expire_error = false;
                    console.log('验证成功，启动脚本~');
                    toast('验证成功，启动脚本~');
                    setTimeout(() => {
                        console.log('到期时间: ' + timestamptoGMT(element.expiretime));
                        toast('到期时间: ' + timestamptoGMT(element.expiretime));
                    }, 3000);
                    gogogo();
                }
            }
        });
        if (device_error) {
            console.log('设备验证失败！');
            toast('设备验证失败！');
            console.log('设备id : ' + android_id);
        } else if (expire_error) {
            console.log('到期时间:' + timestamptoGMT(user_time));
            console.log('设备id : ' + android_id);
            console.log('用户已到期！');
            toast('用户已到期！');
        }
    } catch (error) {
        console.log(error);
    }
}
// 验证循环
var getDeviceid = setInterval(function () {
    if (android_id != false) {
        clearInterval(getDeviceid);
        // console.log('id : ' + android_id);
        var url = "https://raw.githubusercontent.com/bcmdy/authentication/main/verify_file.json";
        var arrurl = [
            url,
            "https://gh-proxy.com/" + url,// 韩国
            "https://ghproxy.net/" + url,// 日本
            "https://github.moeyy.xyz/" + url// 其他(新加坡、香港、日本)
        ];
        gourl();
        function gourl() {
            let random = Math.round(Math.random() * 3);
            // console.log(random, arrurl[random]);
            http.get(arrurl[random], {}, {
                success: function (result) {
                    // console.log(result);
                    Authentication(result);
                },
                error: function (err) {
                    // console.log(err);
                    console.log('服务器访问失败，尝试其他线路···');
                    gourl();
                }
            });
        }
    }
}, 100)