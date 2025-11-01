import { UserModel } from '../models/user.model.ts'
import apiService, { ApiResponseModel } from './apiService.ts'

class AuthService {
    constructor() {
    }

    async login(username: string, password: string): Promise<UserModel | ApiResponseModel> {
        const response = await apiService.postRequest('users/login', {}, { username, password });
        if (response.status == 200) {
            const userData = response.data;
            return UserModel.fromAPI(userData);
        } else {
            return response;
        }
    }

    async logout(): Promise<ApiResponseModel> {
        return apiService.postRequest('users/logout');
    }

    async signup(username: string, password: string): Promise<UserModel | ApiResponseModel> {
        const response = await apiService.postRequest('users/signup', {}, { username, password });
        if (response.status == 201) {
            return UserModel.fromAPI(response.data);
        } else {
            return response;
        }
    }

    async getCurrentUser(): Promise<UserModel | ApiResponseModel> {
        const response = await apiService.getRequest('users/me');
        if (response.status == 200) {
            return UserModel.fromAPI(response.data);
        } else {
            return response;
        }
    }
}

const authService = new AuthService();
export default authService;