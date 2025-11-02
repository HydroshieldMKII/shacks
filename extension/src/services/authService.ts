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
        const response = await apiService.postRequest('users/logout');
        // Clear session cookies after logout
        await apiService.clearSession();
        return response;
    }

    async signup(username: string, email: string, password: string): Promise<UserModel | ApiResponseModel> {
        const response = await apiService.postRequest('users/signup', {}, { username, email, password });
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

    async isAuthenticated(): Promise<boolean> {
        const sessionCookie = await apiService.getSessionCookie();
        return sessionCookie !== null;
    }
}

const authService = new AuthService();
export default authService;