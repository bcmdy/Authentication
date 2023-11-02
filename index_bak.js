import CryptoJS from "crypto-js";
import fs from "fs";
// import { argv } from 'node:process';
// process.argv.forEach((val, index) => {
//     console.log(`${index}: ${val}`);
// });
// console.log(process.argv.length);
name(process.argv);
function name(argv) {
    let node, js_url;// node与当前js的绝对路径
    console.log(node);
    console.log(js_url);
    // gn
    // dec_url:                        // 待解密/加密文件路径
    // key:                            // 密钥
    // user_id:                        // 用户ID
    // user_name:                      // 用户名
    // device_id:                      // 设备ID
    // regtime:                        // 注册时间
    let gn, url, key, user_id, user_name, device_id, regtime, days;
    var argv_len = argv.length
    if (argv_len < 3) {
        console.error("请输入参数运行!");
    } else {
        gn = argv[2];// 需执行的功能
        console.log(gn);
        switch (gn) {
            case 'enc':
                url = argv[3];
                key = argv[4];
                enc(url, key);
                break;
            case 'dec':
                url = argv[3];
                key = argv[4];
                dec(url, key);
                break;
            case 'addtime':
                url = argv[3];
                key = argv[4];
                device_id = argv[5];
                days = parseInt(argv[6]);
                addtime(url, key, device_id, days);
                break;
            case 'adduser':
                url = argv[3];
                key = argv[4];
                user_id = argv[5];
                user_name = argv[6];
                device_id = argv[7];
                regtime = parseInt(argv[8]);
                regtime || (regtime = Date.now());
                adduser(url, key, user_id, user_name, device_id, regtime);
                break;
            case '?':
                help();
                break;
            case '-help':
                help();
                break;
            default:
                console.error('尚未定义的参数!');
        }
    }
}
function help() {
    let log = `enc(url, key)                      // 加密用户数据,通过RC4加密用户数据
    // url:                        // 待解密/加密文件路径
    // key:                            // 密钥
dec(url, key)                      // 解密用户数据,通过RC4解密用户数据
    // url:                        // 待解密/加密文件路径
    // key:                            // 密钥
addtime(url, key, device_id, days) //添加用户时长，单位为天
    // url:                        //待解密文件(加密用户数据)路径
    // key:                            // 密钥
    // device_id:                      // 设备ID
    // days:                           // 增加天数(如已经到期，增加时间为当前时间+天数)
adduser(url, key, user_id, user_name, device_id, regtime)
    // url:                        // 待解密文件(加密用户数据)路径
    // key:                            // 密钥
    // user_id:                        // 用户ID
    // user_name:                      // 用户名
    // device_id:                      // 设备ID
    // regtime:                        // 注册时间13位时间戳, 为空时默认为当前服务器时间`;
    console.log(log);
}
function dec(url, key) {
    if (fs.existsSync(url) == false) {
        console.log("文件不存在! 自动空白加密文件");
        fs.writeFileSync(url, "[]");
        enc(url, key);
    }
    let userdata_enc = fs.readFileSync(url, "utf-8");
    let userdata_dec = CryptoJS.RC4.decrypt(userdata_enc.toString(), key).toString(CryptoJS.enc.Utf8);
    fs.writeFileSync(url, userdata_dec);
    // console.log(userdata_dec);
    let userdata = JSON.parse(userdata_dec);
    return userdata;
}
function enc(url, key) {
    if (fs.existsSync(url) == false) {
        console.log("文件不存在! 自动空白加密文件");
        fs.writeFileSync(url, "[]");
    }
    let userdata_dec = fs.readFileSync(url, "utf-8");
    let userdata_enc = CryptoJS.RC4.encrypt(userdata_dec, key).toString();
    fs.writeFileSync(url, userdata_enc);
    // console.log(userdata_enc);
    return userdata_enc;
}
function addtime(url, key, device_id, days) {
    let userdata = dec(url, key);
    userdata.forEach(element => {
        if (device_id == "*" || element.device_id == device_id) {
            if (element.expiretime <= Date.now()) {
                element.expiretime = parseInt(Date.now() + parseFloat(days) * 24 * 60 * 60 * 1000);
                console.log("超时添加");
            } else {
                element.expiretime = parseInt(element.expiretime + parseFloat(days) * 24 * 60 * 60 * 1000);
                console.log("时间累加");
            }
        }
    });
    let userdata_dec = JSON.stringify(userdata);
    // console.log(userdata_dec);
    fs.writeFileSync(url, userdata_dec);
    let userdata_enc = enc(url, key);
    return userdata_enc;
}
function adduser(url, key, user_id, user_name, device_id, regtime) {
    let pd_sfcf = false;
    let userdata = dec(url, key);
    let newuser = {
        user_id: user_id,
        user_name: user_name,
        device_id: device_id,
        regtime: regtime,
        expiretime: Date.now(),
    }
    userdata.forEach(element => {
        if (element.device_id == newuser.device_id) {
            pd_sfcf = true;
        }
    });
    if (pd_sfcf) {
        console.error("设备已存在请勿重复添加！");
    } else {
        userdata.push(newuser);
        let userdata_dec = JSON.stringify(userdata);
        // console.log(userdata_dec);
        fs.writeFileSync(url, userdata_dec);
    }
    let userdata_enc = enc(url, key);
    return userdata_enc;
}

