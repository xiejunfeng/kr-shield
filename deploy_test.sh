#!/bin/bash


npm set chromedriver_cdnurl http://cdn.npm.taobao.org/dist/chromedriver
npm set selenium_cdnurl=http://npm.taobao.org/mirrors/selenium
##下载需要翻墙，所以直接写入文件
##mv ./.selenium ./node_modules/selenium-standalone

###### 业务逻辑 前端+后端
app=./*
frontend=work/frontend
pathstr=$frontend/prod/36kr/kr-shield
rsync -rvltOD $app .babelrc www@ali-rong-$1:/data/docker/$2/$pathstr




ssh www@ali-rong-$1  sudo docker exec $2 chmod -R 755 /data/$pathstr/test/
#ssh www@ali-rong-docker-01 chmod -R 755 /data/$pathstr/node_modules/selenium-standalone/.selenium/

