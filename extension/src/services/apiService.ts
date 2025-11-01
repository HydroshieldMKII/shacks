class ApiResponseModel {
    readonly data: any;
    readonly status: number;
    readonly headers: Headers;
    readonly error?: string;

    constructor(data: any, status: number, headers: Headers, error?: string) {
        this.data = data;
        this.status = status;
        this.headers = headers;
        this.error = error;
    }
}

class ApiService {
    private readonly BASE_URL = 'http://localhost:3000/';

    async getRequest(query: string, params?: { [key: string]: string }): Promise<ApiResponseModel> {
        return fetch(`${this.BASE_URL}${query}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            return response.json().then(data => {
                return new ApiResponseModel(data, response.status, response.headers);
            });
        }).catch(error => {
            return new ApiResponseModel(null, 500, new Headers(), error.message);
        });
    }

    async postRequest(query: string, params?: { [key: string]: string }, body?: any): Promise<ApiResponseModel> {
        return fetch(`${this.BASE_URL}${query}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        }).then(response => {
            return response.json().then(data => {
                return new ApiResponseModel(data, response.status, response.headers);
            });
        }).catch(error => {
            return new ApiResponseModel(null, 500, new Headers(), error.message);
        });
    }

    async deleteRequest(query: string, params?: { [key: string]: string }): Promise<ApiResponseModel> {
        return fetch(`${this.BASE_URL}${query}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            return response.json().then(data => {
                return new ApiResponseModel(data, response.status, response.headers);
            });
        }).catch(error => {
            return new ApiResponseModel(null, 500, new Headers(), error.message);
        });
    }

    async putRequest(query: string, params?: { [key: string]: string }, body?: any): Promise<ApiResponseModel> {
        return fetch(`${this.BASE_URL}${query}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        }).then(response => {
            return response.json().then(data => {
                return new ApiResponseModel(data, response.status, response.headers);
            });
        }).catch(error => {
            return new ApiResponseModel(null, 500, new Headers(), error.message);
        });
    }

    async patchRequest(query: string, params?: { [key: string]: string }, body?: any): Promise<ApiResponseModel> {
        return fetch(`${this.BASE_URL}${query}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        }).then(response => {
            return response.json().then(data => {
                return new ApiResponseModel(data, response.status, response.headers);
            });
        }).catch(error => {
            return new ApiResponseModel(null, 500, new Headers(), error.message);
        });
    }
}
const apiService = new ApiService();

export default apiService;
export { ApiResponseModel }