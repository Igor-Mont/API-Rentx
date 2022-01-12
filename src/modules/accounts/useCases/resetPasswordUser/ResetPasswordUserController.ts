import { Request, Response } from "express";
import { container } from "tsyringe";
import { ResetPassordUserUseCase } from "./ResetPassordUserUseCase";

class ResetPasswordUserController {

  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;

    const resetPasswordUserUseCase = container.resolve(ResetPassordUserUseCase);

    await resetPasswordUserUseCase.execute({ token: String(token), password });

    return response.send()
  }
}

export { ResetPasswordUserController }