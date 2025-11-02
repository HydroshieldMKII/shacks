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

class CookieManager {
    private readonly domain: string;

    constructor(domain: string) {
        this.domain = domain;
    }

    // Parse Set-Cookie header and store it using Chrome API
    async handleSetCookieHeader(setCookieHeader: string): Promise<void> {
        try {
            const cookieString = setCookieHeader.split(';')[0]; // Get the cookie name=value part
            const [name, value] = cookieString.split('=');
            
            if (name && value) {
                const decodedValue = decodeURIComponent(value);
                
                // Parse cookie attributes
                const attributes = this.parseCookieAttributes(setCookieHeader);
                
                // Set cookie using Chrome API
                await chrome.cookies.set({
                    url: this.domain,
                    name: name.trim(),
                    value: decodedValue,
                    path: attributes.path || '/',
                    expirationDate: attributes.expires ? Math.floor(attributes.expires.getTime() / 1000) : undefined,
                    secure: attributes.secure,
                    sameSite: this.mapSameSite(attributes.sameSite)
                });
            }
        } catch (error) {
            console.error('Failed to set cookie:', error);
        }
    }

    // Get cookie value by name using Chrome API
    async getCookie(name: string): Promise<string | null> {
        try {
            const cookie = await chrome.cookies.get({
                url: this.domain,
                name: name
            });
            return cookie ? cookie.value : null;
        } catch (error) {
            console.error('Failed to get cookie:', error);
            return null;
        }
    }

    // Get all cookies for the domain
    async getAllCookies(): Promise<chrome.cookies.Cookie[]> {
        try {
            return await chrome.cookies.getAll({
                url: this.domain
            });
        } catch (error) {
            console.error('Failed to get all cookies:', error);
            return [];
        }
    }

    // Remove cookie by name
    async removeCookie(name: string): Promise<void> {
        try {
            await chrome.cookies.remove({
                url: this.domain,
                name: name
            });
        } catch (error) {
            console.error('Failed to remove cookie:', error);
        }
    }

    // Parse cookie attributes from Set-Cookie header
    private parseCookieAttributes(setCookieHeader: string): {
        path?: string;
        expires?: Date;
        secure?: boolean;
        sameSite?: string;
    } {
        const attributes: any = {};
        
        const parts = setCookieHeader.split(';');
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i].trim();
            const [key, value] = part.split('=');
            
            switch (key.toLowerCase()) {
                case 'path':
                    attributes.path = value;
                    break;
                case 'expires':
                    attributes.expires = new Date(value);
                    break;
                case 'secure':
                    attributes.secure = true;
                    break;
                case 'samesite':
                    attributes.sameSite = value.toLowerCase();
                    break;
            }
        }
        
        return attributes;
    }

    // Map SameSite attribute to Chrome API format
    private mapSameSite(sameSite?: string): "strict" | "lax" | "no_restriction" | "unspecified" | undefined {
        switch (sameSite?.toLowerCase()) {
            case 'strict':
                return 'strict';
            case 'lax':
                return 'lax';
            case 'none':
                return 'no_restriction';
            default:
                return 'lax'; // Default fallback
        }
    }
}

class ApiService {
    private readonly BASE_URL = 'https://api-dev.trust.hydroshield.dev/';
    private readonly cookieManager: CookieManager;

    constructor() {
        this.cookieManager = new CookieManager(this.BASE_URL);
    }

    // Handle cookies from response headers
    private async handleResponseCookies(response: Response): Promise<void> {
        const setCookieHeaders = response.headers.getSetCookie();
        for (const cookieHeader of setCookieHeaders) {
            await this.cookieManager.handleSetCookieHeader(cookieHeader);
        }
    }

    // Get session cookie for requests
    async getSessionCookie(): Promise<string | null> {
        return await this.cookieManager.getCookie('connect.sid');
    }

    // Clear all session cookies
    async clearSession(): Promise<void> {
        await this.cookieManager.removeCookie('connect.sid');
    }

    // Handle 401 Unauthorized responses
    private async handle401Response(): Promise<void> {
        // Clear session cookies
        await this.clearSession();
        
        // Redirect to login page
        // Check if we're in an extension context or web context
        if (typeof window !== 'undefined' && window.location) {
            window.location.href = '/login';
        }
    }

    async getRequest(query: string, params?: { [key: string]: string }): Promise<ApiResponseModel> {
        try {
            const sessionCookie = await this.getSessionCookie();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            
            // Add session cookie to headers if available
            if (sessionCookie) {
                headers['Cookie'] = `connect.sid=${sessionCookie}`;
            }

            const response = await fetch(`${this.BASE_URL}${query}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
                method: 'GET',
                credentials: 'include',
                headers,
            });

            // Handle cookies from response
            await this.handleResponseCookies(response);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                await this.handle401Response();
                return new ApiResponseModel(null, 401, response.headers, 'Session expired. Please log in again.');
            }

            const data = await response.json();
            return new ApiResponseModel(data, response.status, response.headers);
        } catch (error: any) {
            return new ApiResponseModel(null, 500, new Headers(), error.message);
        }
    }

    async postRequest(query: string, params?: { [key: string]: string }, body?: any): Promise<ApiResponseModel> {
        try {
            const sessionCookie = await this.getSessionCookie();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            
            // Add session cookie to headers if available
            if (sessionCookie) {
                headers['Cookie'] = `connect.sid=${sessionCookie}`;
            }

            const response = await fetch(`${this.BASE_URL}${query}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
                method: 'POST',
                credentials: 'include',
                headers,
                body: body ? JSON.stringify(body) : null,
            });

            // Handle cookies from response
            await this.handleResponseCookies(response);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                await this.handle401Response();
                return new ApiResponseModel(null, 401, response.headers, 'Session expired. Please log in again.');
            }

            const data = await response.json();
            return new ApiResponseModel(data, response.status, response.headers);
        } catch (error: any) {
            return new ApiResponseModel(null, 500, new Headers(), error.message);
        }
    }

    async deleteRequest(query: string, params?: { [key: string]: string }): Promise<ApiResponseModel> {
        try {
            const sessionCookie = await this.getSessionCookie();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            
            // Add session cookie to headers if available
            if (sessionCookie) {
                headers['Cookie'] = `connect.sid=${sessionCookie}`;
            }

            const response = await fetch(`${this.BASE_URL}${query}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
                method: 'DELETE',
                credentials: 'include',
                headers,
            });

            // Handle cookies from response
            await this.handleResponseCookies(response);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                await this.handle401Response();
                return new ApiResponseModel(null, 401, response.headers, 'Session expired. Please log in again.');
            }

            const data = await response.json();
            return new ApiResponseModel(data, response.status, response.headers);
        } catch (error: any) {
            return new ApiResponseModel(null, 500, new Headers(), error.message);
        }
    }

    async putRequest(query: string, params?: { [key: string]: string }, data?: any): Promise<ApiResponseModel> {
        try {
            const sessionCookie = await this.getSessionCookie();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            
            // Add session cookie to headers if available
            if (sessionCookie) {
                headers['Cookie'] = `connect.sid=${sessionCookie}`;
            }

            const response = await fetch(`${this.BASE_URL}${query}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
                method: 'PUT',
                credentials: 'include',
                headers,
                body: JSON.stringify(data),
            });

            // Handle cookies from response
            await this.handleResponseCookies(response);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                await this.handle401Response();
                return new ApiResponseModel(null, 401, response.headers, 'Session expired. Please log in again.');
            }

            const responseData = await response.json();
            return new ApiResponseModel(responseData, response.status, response.headers);
        } catch (error: any) {
            return new ApiResponseModel(null, 500, new Headers(), error.message);
        }
    }

    async patchRequest(query: string, params?: { [key: string]: string }, body?: any): Promise<ApiResponseModel> {
        try {
            const sessionCookie = await this.getSessionCookie();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            
            // Add session cookie to headers if available
            if (sessionCookie) {
                headers['Cookie'] = `connect.sid=${sessionCookie}`;
            }

            const response = await fetch(`${this.BASE_URL}${query}${params ? '?' + new URLSearchParams(params).toString() : ''}`, {
                method: 'PATCH',
                credentials: 'include',
                headers,
                body: body ? JSON.stringify(body) : null,
            });

            // Handle cookies from response
            await this.handleResponseCookies(response);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                await this.handle401Response();
                return new ApiResponseModel(null, 401, response.headers, 'Session expired. Please log in again.');
            }

            const data = await response.json();
            return new ApiResponseModel(data, response.status, response.headers);
        } catch (error: any) {
            return new ApiResponseModel(null, 500, new Headers(), error.message);
        }
    }
}
const apiService = new ApiService();

export default apiService;
export { ApiResponseModel, CookieManager }