import {Account} from "@app/common/types/auth_service/v1/models";

export class AccountMapper {


  static toProtoAccount(account: any): Account {
    return {
      user_id: account.user_id,
      email: account.email,
      password: account.password,
      is_verified: account.is_verified,
      is_blocked: account.is_blocked,
      created_at: this.toTimestamp(account.created_at),
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