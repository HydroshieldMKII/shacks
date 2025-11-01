import { FolderModel } from '../models/folder.model';
import apiService from './apiService';
import { ApiResponseModel } from './apiService';
class FolderService {
    async createFolder(name: string) : Promise<FolderModel | ApiResponseModel> {
        const response = await apiService.postRequest(`/folders`, {}, { name: name });
        if (response.status == 201) {
            return FolderModel.fromAPI(response.data);
        } else {
            return response;
        }
    }

    async updateFolder(id: number, name: string) : Promise<FolderModel | ApiResponseModel> {
        const response = await apiService.patchRequest(`/folders/${id}`, {}, { name: name });
        if (response.status == 200) {
            return FolderModel.fromAPI(response.data);
        } else {
            return response;
        }
    }

    async deleteFolder(id: number) : Promise<ApiResponseModel> {
        return apiService.deleteRequest(`/folders/${id}`);
    }
}

const folderService = new FolderService();
export default folderService;
