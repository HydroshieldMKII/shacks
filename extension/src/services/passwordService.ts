import { FolderModel } from '../models/folder.model.ts';
import { PasswordModel } from '../models/password.model.ts';
import apiService from './apiService.ts'
import { ApiResponseModel } from './apiService.ts'

class PasswordService {

    async createPassword(title: string, username: string, password: string, url: string, notes?: string, folderId?: number | null): Promise<PasswordModel | ApiResponseModel> {
        const requestBody: any = { 
            name: title, 
            username: username, 
            password: password, 
            url: url, 
            notes: notes, 
            folderId: folderId 
        };
        
        // If folderId is undefined, explicitly set to null 
        if (folderId === undefined) {
            requestBody.folderId = null;
        }
        
        const response = await apiService.postRequest(`/passwords`, {}, requestBody);
        if (response.status == 201) {
            return PasswordModel.fromAPI(response.data);
        } else {
            return response;
        }
    }

    async getPasswords(): Promise<FolderModel[] | ApiResponseModel> {
        const response = await apiService.getRequest(`/passwords`);
        if (response.status == 200) {
            return response.data.map((folderData: any) => FolderModel.fromAPI(folderData));
        } else {
            return response;
        }
    }

    async getPassword(id: number): Promise<PasswordModel | ApiResponseModel> {
        const response = await apiService.getRequest(`/passwords/${id}`);
        if (response.status == 200) {
            return PasswordModel.fromAPI(response.data);
        } else {
            return response;
        }
    }

    async updatePassword(id: number, title: string, username: string, password: string, url: string, notes?: string, folderId?: number | null): Promise<PasswordModel | ApiResponseModel> {
        const requestBody: any = { 
            name: title, 
            username: username, 
            password: password, 
            url: url, 
            notes: notes, 
            folderId: folderId 
        };
        
        // If folderId is undefined, explicitly set to null to clear the folder
        if (folderId === undefined) {
            requestBody.folderId = null;
        }
        
        const response = await apiService.patchRequest(`/passwords/${id}`, {}, requestBody);
        if (response.status == 200) {
            return PasswordModel.fromAPI(response.data);
        } else {
            return response;
        }
    }

    async deletePassword(id: number): Promise<PasswordModel | ApiResponseModel> {
        const response = await apiService.deleteRequest(`/passwords/${id}`);
        if (response.status == 200) {
            return PasswordModel.fromAPI(response.data);
        } else {
            return response;
        }
    }
}

const passwordService = new PasswordService();
export default passwordService;
