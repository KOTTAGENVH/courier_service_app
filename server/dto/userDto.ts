// dto.ts
import { IsString, IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNotEmpty()
    @IsString()
    @Length(10, 15)
    telephone!: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 32)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
        message: 'Password too weak: must contain letters and numbers',
    })
    password!: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 32)
    confirmPassword!: string;
}
