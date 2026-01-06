import {Test, TestingModule} from '@nestjs/testing';
import {MonolithController} from './monolith.controller';
import {MonolithService} from './monolith.service';

describe('MonolithController', () => {
    let monolithController: MonolithController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [MonolithController],
            providers: [MonolithService],
        }).compile();

        monolithController = app.get<MonolithController>(MonolithController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(monolithController.getHello()).toBe('Hello World!');
        });
    });
});
