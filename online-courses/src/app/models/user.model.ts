export class SignUpUser {
    constructor(
      public role: string,
      public name: string,
      public email: string,
      public password: string
    ) {}
  }
  
  export class SignInUser {
    constructor(public email: string, public password: string) {}
  }
  export class User {
    constructor(
      public id: string | null,
      public role: string,
      public name: string,
      public email: string,
      public password: string
    ) {}
  }
  
  export const emptyUser = new User('', '', '', '', '');