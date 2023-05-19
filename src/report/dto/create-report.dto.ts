import { IsEmail, IsString } from 'class-validator';
export class CreateReportDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
