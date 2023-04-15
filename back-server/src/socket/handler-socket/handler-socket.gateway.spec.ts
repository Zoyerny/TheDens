import { Test, TestingModule } from '@nestjs/testing';
import { HandlerSocketGateway } from './handler-socket.gateway';

describe('HandlerSocketGateway', () => {
  let gateway: HandlerSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandlerSocketGateway],
    }).compile();

    gateway = module.get<HandlerSocketGateway>(HandlerSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
