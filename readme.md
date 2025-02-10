## npm init (세부 설치 내역)
npm install apollo-server graphql
npm install -D nodemon

npm install prisma@5 --save-dev

## Prisma 초기화
npx prisma init --datasource-provider mysql

## 기존 테이블을 Prisma 모델로 변환 (db pull)
npx prisma db pull

## migrate 변경 사항 미리 확인 (migrate diff 사용)
npx prisma migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma

## ❗️주의 Mysql 테이블 변경 (migrate 실행)❗️
npx prisma migrate dev --name init

## Prisma Client 생성 (prisma generate)
npx prisma generate
