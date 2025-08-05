import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterUserDto {
  // REMOVED: countryCode, phoneNumber, email - now taken from session

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  // Registration token field
  @IsString()
  @IsNotEmpty({ message: 'Registration token is required' })
  registrationToken!: string;
}