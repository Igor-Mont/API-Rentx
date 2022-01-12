import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "../IUsersRepository";


class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = []

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find(user => user.email == email);
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find(user => user.id == id);
    return user;
  }

  async create({ driver_license, email, name, password, avatar }: ICreateUserDTO): Promise<void> {
    const user = new User();

    Object.assign(user, {
      driver_license, email, name, password, avatar
    });

    this.users.push(user);
  }
}

export { UsersRepositoryInMemory };