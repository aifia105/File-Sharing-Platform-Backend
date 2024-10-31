import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: UserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Error while creating  new user',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Error while fetching users',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.userModel.findOne({ _id: id }).exec();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Error while fetching user by id',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: string, updateUserDto: UserDto) {
    try {
      const user = this.userModel.findOne({ _id: id }).exec();
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return await this.userModel
        .updateOne({ _id: id }, updateUserDto, { new: true })
        .exec();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Error while updating user',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async remove(id: string): Promise<User> {
    try {
      const user = this.userModel.findOne({ _id: id }).exec();
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return await this.userModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Error while updating user',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
