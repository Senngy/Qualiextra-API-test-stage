import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Patch,
    Delete,
    Route,
    Request,
    SuccessResponse,
} from "tsoa";
import { UserService } from "../services/user.service";
import type { UserCreationParams } from "../types/userType";
import { UserOutput } from "../types/userType";
import { AuthService } from "../services/auth.service";
import { EmailService } from "../services/email.service";
import { AuthRequest } from "../middlewares/auth.middleware";

@Route("users")
export class UserController extends Controller {
    private userService = new UserService();
    private authService = new AuthService(new EmailService()); // Pour décoder le token


    @Get("{userId}")
    public async getUser(@Path() userId: number, @Request() req: AuthRequest): Promise<UserOutput | null> {
        const currentUser = req.currentUser!; // On sait que currentUser est défini grâce au middleware d’authentification

        if (currentUser.role !== "ADMIN" && currentUser.userId !== userId) { // Admin peut voir n'importe qui, utilisateur standard seulement lui-même
            throw new Error("Unauthorized");
        }

        return this.userService.getById(userId);
    }

    @Get()
    public async getAllUsers(@Request() req: AuthRequest): Promise<UserOutput[]> {
        const currentUser = req.currentUser!;

        if (currentUser.role !== "ADMIN") { // Seul l’admin peut voir tous les utilisateurs
            throw new Error("Unauthorized");
        }

        return this.userService.getAll();
    }

    @SuccessResponse(201, "Created")
    @Post()
    public async createUser(@Body() body: UserCreationParams, @Request() req: AuthRequest): Promise<UserOutput> {
        const currentUser = req.currentUser!;

        if (currentUser.role !== "ADMIN") { // Seul l’admin peut créer des utilisateurs
            throw new Error("Unauthorized"); 
        }

        return this.userService.create(body);
    }

    @SuccessResponse(200, "Updated")
    @Patch("{userId}")
    public async updateUser(
        @Path() userId: number,
        @Body() body: Partial<UserCreationParams>,
        @Request() req: AuthRequest
    ): Promise<UserOutput> {
        const currentUser = req.currentUser!;

        if (currentUser.role !== "ADMIN" && currentUser.userId !== userId) { // Un utilisateur peut seulement se mettre à jour lui-même et l’admin peut mettre à jour n’importe qui
            throw new Error("Unauthorized");
        }

        return this.userService.update(userId, body);
    }

    @SuccessResponse(200, "Deleted")
    @Delete("{userId}")
    public async deleteUser(@Path() userId: number, @Request() req: AuthRequest): Promise<UserOutput> {
        const currentUser = req.currentUser!;

        if (currentUser.role !== "ADMIN") { // Seul l’admin peut supprimer un utilisateur
            throw new Error("Unauthorized"); 
        }

        return this.userService.delete(userId); 
    }
}