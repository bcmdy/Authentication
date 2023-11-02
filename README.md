<h1>Authentication</h1>
<h1>跨仓库更新的Actions工具</h1>

# 教程：

# 1.fork仓库

# 2.clong仓库到本地

# 3.生成密钥对
    ssh-keygen -t rsa -C "actions@github.com"

    按照提示完成三次回车, 即可生成 ssh key

    检查本地目录生成的密钥文件, 如不存在请检查目录~/.ssh/(windows系统为C:\Users\用户名/.ssh/)

    无后缀名文件为私钥, .pub文件为公钥

# 4.给目标仓库配置密钥对中的公钥
- 目标仓库(公开仓库, 即用户加密数据保存的仓库/或者说被push的仓库)设置:

    仓库设置 按顺序选择 Setting > Deploy keys > Add deply key 为仓库设置ssh连接公钥


    设置公钥:

    Title 可以自定义取一个方便记忆的名字 如 ACTION_RSA_PUBLIC_KEY

    Key 为公钥(.pub)文件内容, 以"ssh-rsa"开头(以生成密钥对类型为准)

# 5.给本仓库设置密钥对中的私钥及其他秘密
- 本仓库设置(可以设置为私有仓库, 即管理员操作Actions添加时长/用户的仓库)设置:

    仓库设置 按顺序选择 Setting > Secrets and variables > Actions 为Actions脚本设置隐藏秘密常量


    常量1：(设置私钥)

    Title: ACTION_RSA_PRIVATE_KEY (默认名,如需修改请同步Action文件)

    Key: 为私钥(无后缀)文件内容, 以"-----BEGIN OPENSSH PRIVATE KEY-----"开头


    常量2：(设置用户数据加密用RC4密钥)

    Title: ENCODE_KEY (默认名,如需修改请同步Action文件)

    Key: 为加密用户数据的RC4密钥


    常量3：(目标仓库地址)

    title: GIT_URL

    key: git@github.com:user/verify.git (目标仓库的ssh连接地址)

# 注：

- 本仓库内容已做脱敏处理，理论上直接使用此仓库公开做验证也没有问题