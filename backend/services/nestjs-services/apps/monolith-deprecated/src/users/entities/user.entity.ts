import {Exclude, Expose} from "class-transformer";

@Exclude()
export class User {

    @Expose()
    id: string;
    @Expose()
    email: string;

    @Expose()
    company: string;

    @Expose()
    name: string;
}
