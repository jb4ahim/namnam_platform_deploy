import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterUserDto {



  @IsString()
  @IsNotEmpty()
  password!: string;

  // Registration token field
  @IsString()
  @IsNotEmpty({ message: 'Registration token is required' })
  registrationToken!: string;
}