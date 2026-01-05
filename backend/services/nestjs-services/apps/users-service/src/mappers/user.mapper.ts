import {User} from "@app/common/types/users_service/v1/models";

export class UserMapper {


  static toProtoUser(user: any): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      is_verified: false,
      created_at: this.toTimestamp(user.created_at),
      updated_at: undefined
    };
  }

  static toTimestamp(date: Date): any {
    if (!date) return undefined;
    return {
      seconds: Math.floor(date.getTime() / 1000),
      nanos: (date.getTime() % 1000) * 1000000,
    };
  }


  static toDate(timestamp: any): Date {
    if (!timestamp) return new Date();
    if (typeof timestamp === 'string') return new Date(timestamp);
    if (timestamp.seconds !== undefined) return new Date(timestamp.seconds * 1000);
    return new Date();
  }

}