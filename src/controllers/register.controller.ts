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

@Route("register")
export class RegisterController extends Controller {
    private authService = new AuthService(new EmailService()); // Initialize AuthService

    @SuccessResponse(201, "Created")
    @Post()
    public async register(@Body() body: UserCreationParams): Promise<UserOutput> {
        return this.authService.registerUser(body);
    }
}