FROM node:alpine As development
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --force
COPY . .
# Câu lệnh này không thực sự cần thiết, mục đích là build app luôn khi tạo images
# và phục vụ cho câu lệnh run node dist/main ở dưới khi start ứng dụng thay vì npm run start:dev
RUN npm run build
CMD ["node", "dist/main"]

