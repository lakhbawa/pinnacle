import {Exclude, Expose} from "class-transformer";

@Exclude()
export class User {
    @Expose()
    email: string;

    @Expose()
    company: string;
}
