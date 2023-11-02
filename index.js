import CryptoJS from "crypto-js";
import fs from "fs";
/**
 * 解密函数
 * @param {string} url - 文件路径
 * @param {string} key - 解密密钥
 * @returns {Array} - 解密后的数据
 */
function dec(url, key) {
  if (!fs.existsSync(url)) {
    console.log("文件不存在！自动空白加密文件");
    fs.writeFileSync(url, "[]");
    enc(url, key);
  }
  let userdata_enc = fs.readFileSync(url, "utf-8");
  let userdata_dec = CryptoJS.RC4.decrypt(userdata_enc.toString(), key).toString(CryptoJS.enc.Utf8);
  fs.writeFileSync(url, userdata_dec);
  let userdata = JSON.parse(userdata_dec);
  return userdata;
}

/**
 * 加密函数
 * @param {string} url - 文件路径
 * @param {string} key - 加密密钥
 * @returns {string} - 加密后的数据
 */
function enc(url, key) {
  if (!fs.existsSync(url)) {
    console.log("文件不存在！自动空白加密文件");
    fs.writeFileSync(url, "[]");
  }
  let userdata_dec = fs.readFileSync(url, "utf-8");
  let userdata_enc = CryptoJS.RC4.encrypt(userdata_dec, key).toString();
  fs.writeFileSync(url, userdata_enc);
  return userdata_enc;
}

/**
 * 添加时间函数
 * @param {string} url - 文件路径
 * @param {string} key - 解密密钥
 * @param {string} device_id - 设备 ID
 * @param {number} days - 增加的天数
 * @returns {string} - 加密后的数据
 */
function addtime(url, key, device_id, days) {
  let userdata = dec(url, key);
  userdata.forEach(element => {
    if (device_id === "*" || element.device_id === device_id) {
      if (element.expiretime <= Date.now()) {
        element.expiretime = Date.now() + parseInt(days) * 24 * 60 * 60 * 1000;
        console.log("超时添加");
      } else {
        element.expiretime += parseInt(days) * 24 * 60 * 60 * 1000;
        console.log("时间累加");
      }
    }
  });
  let userdata_dec = JSON.stringify(userdata);
  fs.writeFileSync(url, userdata_dec);
  let userdata_enc = enc(url, key);
  return userdata_enc;
}

/**
 * 添加用户函数
 * @param {string} url - 文件路径
 * @param {string} key - 解密密钥
 * @param {string} user_id - 用户 ID
 * @param {string} user_name - 用户名
 * @param {string} device_id - 设备 ID
 * @param {number} regtime - 注册时间
 * @returns {string} - 加密后的数据
 */
function adduser(url, key, user_id, user_name, device_id, regtime) {
  let userdata = dec(url, key);
  let newuser = {
    user_id,
    user_name,
    device_id,
    regtime,
    expiretime: Date.now(),
  };

  if (userdata.some(element => element.device_id === newuser.device_id)) {
    console.error("设备已存在请勿重复添加！");
  } else {
    userdata.push(newuser);
    fs.writeFileSync(url, JSON.stringify(userdata));
  }

  return enc(url, key);
}

/**
 * 将时间戳转换为日期字符串
 * @param {number} timestamp - 时间戳
 * @returns {string} - 日期字符串
 */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 帮助函数，打印命令说明
 */
function help() {
  const log = `enc(url, key)                      // 加密用户数据,通过RC4加密用户数据
    // url:                        // 待解密/加密文件路径
    // key:                            // 密钥
  dec(url, key)                      // 解密用户数据,通过RC4解密用户数据
    // url:                        // 待解密/加密文件路径
    // key:                            // 密钥
  addtime(url, key, device_id, days) // 添加用户时长，单位为天
    // url:                        // 待解密文件(加密用户数据)路径
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

/**
 * 主函数
 * @param {Array} argv - 命令行参数
 */
function main(argv) {
  const argv_len = argv.length;

  if (argv_len < 3) {
    console.error("请输入参数运行!");
  } else {
    const gn = argv[2];
    const url = argv[3];
    const key = argv[4];
    const device_id = argv[5];
    const days = parseInt(argv[6]);
    const user_id = argv[5];
    const user_name = argv[6];
    const regtime = parseInt(argv[8]) || Date.now();

    switch (gn) {
      case 'enc':
        enc(url, key);
        break;
      case 'dec':
        dec(url, key);
        break;
      case 'addtime':
        addtime(url, key, device_id, days);
        break;
      case 'adduser':
        adduser(url, key, user_id, user_name, device_id, regtime);
        break;
      case '?':
      case '-help':
        help();
        break;
      default:
        console.error('尚未定义的参数!');
    }
  }
}

main(process.argv);