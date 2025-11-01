export class PasswordModel {
    folderId: number | null;
    name: string;
    username: string;
    password: string;
    url?: string;
    notes?: string;

    constructor(folderId: number | null, name: string, username: string, password: string, url?: string, notes?: string) {
        this.folderId = folderId;
        this.name = name;
        this.username = username;
        this.password = password;
        this.url = url;
        this.notes = notes;
    }

    static fromAPI(data: any): PasswordModel {
        return new PasswordModel(
            data.folderId,
            data.name,
            data.username,
            data.password,
            data.url,
            data.notes
        );
    }
}