## 目录结构

    + src  // 前端代码
          - index.html // 入口 html，用于页面路由
          - routes.js // 执行页面路由 js
          + public // 公用的资源
            + js // 公用的 js
              + lib // 一些公用插件
              + public // 公用的模块
                - buriedPointStatistics.js // 生产环境埋点
                - buriedPointStatisticsDev.js // 开发环境埋点处理
                - public.js // 一些公用模块
                - showToast.js // toast 封装
          ...
          ...


## 命令

npm run start  启动前端开发环境，浏览器 localhost:3001 访问，这个命令相当于同时执行 npm run server 和 npm run mock

npm run build  对代码进行编译打包，用于测试，主要是排除测试时的买点统计

npm run buildProduct 用于生产环境的打包编译，此时加入埋点统计

npm run server 启动前端页面服务

npm run mock   启动本地后端 mock 数据服务


## 新页面的开发

1. 新建基于 development 的新分支
2. 在 src 下新建文件夹，在该文件下 新建 index.html 和名为 js 的文件夹，js 文件夹下必须存在入口文件 mian.js，新页面文件夹目录应如下：

    e.g

      例如新建名为 'invitation' 的页面

        src
            + invitation
              - index.html
              + js
                - main.js
                ...
              + css
              + assets



## 测试

1. 在开发分支上执行 npm run build 进行测试代码构建
2. 构建完毕后，复制 dist 文件夹到桌面
3. 切换到 测试 分支，删除分支下的 dist 文件夹，将桌面的 dist 文件夹复制到项目中
4. 提交，通知运维部署 测试 分支内容到测试环境


## 发布生产环境

1. 开发并测试完毕后，切换回 development 分支，merge 新分支的代码
2. 在 development 分支下执行 npm run buildProduct 打包编译生产环境代码
3. 构建完毕后，复制 dist 文件夹到桌面
4. 切换到 master 分支，删除分支下的 dist 文件夹，将桌面的 dist 文件夹复制到项目中
5. 提交，通知运维部署 master 内容到测试环境


## 页面访问
  e.g
  
    /index.html?typeCode=${code}

      字符串拼接参数 typeCode，对应code：

      {
        1: 'page1.html',
      }


## 关于埋点

  请在需要埋点统计页面的 js/mian.js 中添加一下代码
  
  `import 'buriedPointStatistics'`
      