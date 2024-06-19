import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(
    value: any,
    _validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const emailIsValid = await this.usersService.searchForEmail(value);
    return !emailIsValid;
  }
}

export const UniqueEmail = (validationOptions: ValidationOptions) => {
  return (object: Object, properties: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: properties,
      options: validationOptions,
      constraints: [],
      validator: UniqueEmailValidator,
    });
  };
};
