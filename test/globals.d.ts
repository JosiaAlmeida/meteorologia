declare namespace NodeJs {
  interface Global {
    testRequest: import('supertest').SuperTest<import('supertest').Test>;
  }
}
