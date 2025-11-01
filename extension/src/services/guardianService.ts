import { GuardianModel } from '../models/guardian.model';
import apiService from './apiService';
import { ApiResponseModel } from './apiService';

type GuardianListType = {
    protecting: GuardianModel[];
    protected: GuardianModel[];
}

class GuardianService {

    async getGuardians(): Promise<GuardianListType | ApiResponseModel> {
        const response = await apiService.getRequest(`/guardians`);
        if (response.status === 200) {
            const data = response.data;
            const protecting = data.protecting.map((item: any) => GuardianModel.fromAPI(item));
            const protectedList = data.protected.map((item: any) => GuardianModel.fromAPI(item));
            return {
                protecting: protecting,
                protected: protectedList
            };
        } else {
            return response;
        }
    }

    async createGuardian(email: string): Promise<GuardianModel | ApiResponseModel> {
        const response = await apiService.postRequest(`/guardians`, { guardedEmail: email });
        if (response.status === 201) {
            return GuardianModel.fromAPI(response.data);
        } else {
            return response;
        }
    }

    async removeGuardian(id: number): Promise<ApiResponseModel> {
        return apiService.deleteRequest(`/guardians/${id}`);
    }
}

const guardianService = new GuardianService();
export default guardianService;
export type { GuardianListType };
