export class UserModel {
    id: number;
    username: string;
    email: string;

    constructor(id: number, username: string, email: string) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    static fromAPI(data: any): UserModel {
        return new UserModel(data.id, data.username, data.email);
    }
}