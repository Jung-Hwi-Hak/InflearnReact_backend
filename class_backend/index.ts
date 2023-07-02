// node 는 javascript 를 실행해주는거지 타입스크립트를 실행해주는 프로그램이 아니기에 오류가 발생
// 해결방안은. 타입스크립트를 자바스크립트로 변환해주던지 또는 타입스크립트 실행프로그램으로 실행해야한다 ( tsnode )

import { DataSource } from "typeorm";
import { Board } from "./Board.postgres";
const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5001,
  username: "postgres",
  password: "postgres1",
  database: "postgres",
  entities: [Board],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("DB접속 성공!");
  })
  .catch((err) => {
    console.log("DB접속 실패!", err);
  });
