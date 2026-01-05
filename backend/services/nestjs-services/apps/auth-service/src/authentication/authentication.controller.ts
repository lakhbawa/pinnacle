import {Controller} from '@nestjs/common';
import {AuthenticationService} from './authentication.service';

import {
    AuthServiceController, AuthServiceControllerMethods, RefreshTokenRequest,
    SignInRequest,
    SignUpRequest
} from "@app/common/types/auth_service/v1/auth";
import {AuthenticatedResponse} from '@app/common/types/auth_service/v1/models';

@Controller()
@AuthServiceControllerMethods()
export class AuthenticationController implements AuthServiceController {
    constructor(private readonly authenticationService: AuthenticationService) {
    }


    async signIn(request: SignInRequest): Promise<AuthenticatedResponse> {
        console.log('Received request:', JSON.stringify(request, null, 2));
        return await this.authenticationService.signIn(request);
    }

    async signUp(request: SignUpRequest): Promise<AuthenticatedResponse> {

        console.log('Received request:', JSON.stringify(request, null, 2));
        return await this.authenticationService.signUp(request);

    }

    async refreshToken(request: RefreshTokenRequest): Promise<AuthenticatedResponse> {
        return await this.authenticationService.refreshToken(request);
    }
}
