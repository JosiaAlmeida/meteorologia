//responsavel por iniciar o servidor para todos os testes funcionarem
import { SetupServer } from '../src/Server';
import supertest from 'supertest';

export default beforeAll(() => {
  const server = new SetupServer();
  server.init();
  //global.testRequest = supertest(server.getApp())
});
