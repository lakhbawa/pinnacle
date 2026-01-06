import { PartialType } from '@nestjs/mapped-types';
import {SignUpDto} from './signup.dto';

export class SignInDto extends PartialType(SignUpDto) {}
