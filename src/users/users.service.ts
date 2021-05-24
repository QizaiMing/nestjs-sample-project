import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = new this.userModel(createUserDto);
      return await newUser.save();
    } catch (ValidationError) {
      return ValidationError.errors;
    }
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async update(id: number, createUserDto: CreateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      createUserDto,
    );
    return updatedUser;
  }

  async remove(id: number) {
    const deletedUser = await this.userModel.findOneAndDelete({ id });
    return deletedUser;
  }
}
