export class GuardianModel {
    id: number;
    guardedEmail: string;
    userId: number;
    guardianKeyValue?: string;

    constructor(id: number, guardedEmail: string, userId: number, guardianKeyValue?: string) {
        this.id = id;
        this.guardedEmail = guardedEmail;
        this.userId = userId;
        this.guardianKeyValue = guardianKeyValue;
    }

    static fromAPI(data: any): GuardianModel {
        return new GuardianModel(
            data.id,
            data.guardedEmail,
            data.userId,
            data.guardianKeyValue
        );
    }
}