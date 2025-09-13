import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterUserDto {



  @IsString()
  @IsNotEmpty()
  password!: string;

  // Verification token field
  @IsString()
  @IsNotEmpty({ message: 'Verification token is required' })
  verifyToken!: string;
}