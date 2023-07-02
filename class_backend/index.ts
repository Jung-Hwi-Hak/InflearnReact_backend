// node 는 javascript 를 실행해주는거지 타입스크립트를 실행해주는 프로그램이 아니기에 오류가 발생
// 해결방안은. 타입스크립트를 자바스크립트로 변환해주던지 또는 타입스크립트 실행프로그램으로 실행해야한다 ( tsnode )

import { DataSource } from "typeorm";
import { Board } from "./Board.postgres";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// API DOCS
const typeDefs = `#graphql
  input CreateBoardInput{
    writer: String
    title: String
    contents: String
  }

  type MyBoard {
    number: Int
    title: String
    writer: String
    contents: String
  }

  type Query {
    fetchBoard: [MyBoard]!
  }

  type Mutation {
    # 연습용
    #createBoard(writer: String, title: String, contents: String): String

    # 실무용
    createBoard(createBoardInput:CreateBoardInput):String
  }
`;

// API
const resolvers = {
  Query: {
    fetchBoard: async () => {
      // 모두 조회
      const result = await Board.find();
      console.log(result);

      // 단건 조회
      // const result = await Board.findOne({
      //   where: { number: 3 },
      // });
      // console.log(result);

      return result;
    },
  },
  Mutation: {
    createBoard: async (parent: any, args: any, context: any, info: any) => {
      await Board.insert({
        ...args.createBoardInput,
        // title: args.createBoardInput.title,
        // writer: args.createBoardInput.writer,
        // contents: args.createBoardInput.contents,
      });
      return "게시글 등록에 성공!";
    },

    // updateBoard: async () => {
    // Board.update({조건},{수정내용})
    // await Board.update({ number: 3 }, { writer: "영희" });
    // },

    // deleteBoard: async () => {
    //   // 진짜 삭제
    //   // await Board.delete({ number: 3 });
    //   // 삭제로 취급 ( 복원 가능 ) - 소프트삭제
    //   // await Board.update({number: 3}, {isDeleted: true})
    //   // 삭제로 취급 - deletedAt 값이 NULL 이면 삭제 X
    //   // await Board.update({ number: 3 }, { deletedAt: new Date() });
    // },
  },
};

// @ts-ignore
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // cors: true,
  // 선택적 풀기
  // cors: {
  //   origin: ["http://naver.com", "http://coupang.com"]
  // }
});

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

    startStandaloneServer(server).then(() => {
      console.log("graphql 서버 실행!");
    });
  })
  .catch((err) => {
    console.log("DB접속 실패!", err);
  });
