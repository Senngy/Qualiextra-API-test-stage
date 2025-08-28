import {
    Body,
    Controller,
    Get,
    Post,
    Route,
    SuccessResponse,
} from "tsoa";
import { AuthService } from "../services/auth.service";
import { EmailService } from "../services/email.service";


@Route("login")
export class LoginController extends Controller {
    private authService = new AuthService(new EmailService()); // Initialize AuthService

    @SuccessResponse(200, "OK")
    @Post()
    public async login(@Body() body: { email: string; password: string }): Promise<{ token: string }> {
        const { token } = await this.authService.loginUser(body.email, body.password);
        return { token };
    }

}