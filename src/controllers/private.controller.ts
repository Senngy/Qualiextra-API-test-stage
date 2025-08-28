// src/controllers/private.controller.ts
import { Controller, Get, Route, Request } from "tsoa";
import { AuthRequest } from "../middlewares/auth.middleware";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

@Route("private")
export class PrivateController extends Controller {
    @Get()
    public async sayHelloToUser(@Request() req: AuthRequest): Promise<{ message: string }> {
        const currentUser = req.currentUser!;
        const user = await prisma.user.findUnique({ where: { id: currentUser.userId } });

        if (!user) {
            this.setStatus(404);
            throw new Error("User not found");
        }

        return { message: `Hello ${user.firstname}` };
    }
}