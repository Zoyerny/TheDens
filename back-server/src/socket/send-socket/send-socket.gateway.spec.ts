import { Test, TestingModule } from '@nestjs/testing';
import { SendSocketGateway } from './send-socket.gateway';

describe('SendSocketGateway', () => {
  let gateway: SendSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendSocketGateway],
    }).compile();

    gateway = module.get<SendSocketGateway>(SendSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
