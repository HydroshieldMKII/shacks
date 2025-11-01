import { PasswordModel } from "./password.model";

export class FolderModel {
    id: number;
    name: string;
    userId?: number;
    passwords: PasswordModel[];

    constructor(id: number, name: string, userId?: number, passwords: PasswordModel[] = []) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.passwords = passwords;
    }

    static fromAPI(data: any): FolderModel {
        const passwords = data.passwords ? data.passwords.map((pwdData: any) => PasswordModel.fromAPI(pwdData)) : [];
        return new FolderModel(
            data.id,
            data.name,
            data.userId,
            passwords
        );
    }
}
