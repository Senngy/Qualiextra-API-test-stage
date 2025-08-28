import {
    Body,
    Controller,
    Get,
    Post,
    Route,
    SuccessResponse,
    Query
} from "tsoa";
import { AuthService } from "../services/auth.service";
import { EmailService } from "../services/email.service";
import type { UserCreationParams } from "../types/userType";
import { UserOutput } from "../types/userType";

@Route("auth")
export class AuthController extends Controller {
    private authService = new AuthService(new EmailService()); // Initialize AuthService

    @SuccessResponse(200, "OK")
    @Post("login")
    public async login(@Body() body: { email: string; password: string }): Promise<{ token: string }> {
        const { token } = await this.authService.loginUser(body.email, body.password);
        return { token };
    }

    @SuccessResponse(201, "Created")
    @Post("register")
    public async register(@Body() body: UserCreationParams): Promise<UserOutput> {
        return this.authService.registerUser(body);
    }

    @SuccessResponse(200, "OK")
    @Get("verify-email")
    public async verifyEmail(@Query() token: string): Promise<{ verified: boolean; message: string }> {
        const result = await this.authService.verifyEmail(token); // On utilise le service d’authentification pour vérifier l’email
        if (!result) {
            this.setStatus(400);
            return { verified: false, message: "Invalid or expired token" };
        }

        return { verified: true, message: "Email successfully verified" };
    }

}