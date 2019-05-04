#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
npm run build

# cd 到构建输出的目录下 
# cd dist

# 部署到自定义域域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m '提交到master分支'

# 部署到 https://<USERNAME>.github.io
# git push -f git@github.com:xjinky/xjinky.github.io.git master

# 部署到 https://<USERNAME>.github.io/<REPO>
# git push -f https://github.com/xjinky/cnode-demo.git master:gh-pages    # 提交到gh-pages分支
git push -f https://github.com/xjinky/cnode-demo.git master    # 提交到master分支

cd -