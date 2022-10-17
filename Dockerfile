# # 基础镜像
# FROM node:16-alpine3.15

# # MAINTAINER 维护者信息
# LABEL MAINTAINER="pjuan"

# # 创建代码目录
# RUN mkdir /usr/local/pjuan-website

# # 复制目录
# COPY . /usr/local/pjuan-website

# # 进入目录工作
# WORKDIR /usr/local/pjuan-website

# # 安装依赖
# RUN npm install \
#     && npm run build

# 安装nginx
FROM nginx

# COPY ./index.html /usr/share/nginx/html/index.html
# COPY ./nginx.conf /etc/nginx/nginx.conf
# COPY ./default.conf /etc/nginx/conf.d/default.conf

# 复制打包好的 dist 目录至 html 目录霞
COPY ./dist /usr/share/nginx/html

# # 复制 nginx 配置
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80


