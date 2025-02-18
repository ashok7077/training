"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZohoDeskSelfClientApi = void 0;
class ZohoDeskSelfClientApi {
    constructor() {
        this.name = 'zohoDeskSelfClient-Api';
        this.displayName = 'Zoho Desk Self Client API';
        this.documentationUrl = 'https://desk.zoho.in/DeskAPIDocument#self-client';
        this.properties = [
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'The Client ID obtained from Zoho Developer Console',
            },
            {
                displayName: 'Client Secret',
                name: 'clientSecret',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'The Client Secret obtained from Zoho Developer Console',
            },
            {
                displayName: 'Refresh Token',
                name: 'refreshToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'The Refresh Token for authentication',
            },
            {
                displayName: 'Organization ID',
                name: 'orgId',
                type: 'string',
                default: '',
                required: true,
                description: 'The Organization ID for Zoho Desk API requests',
            },
            {
                displayName: 'Contact ID',
                name: 'contactId',
                type: 'string',
                default: '',
                required: true,
                description: 'The default Contact ID for ticket creation',
            },
            {
                displayName: 'Department ID',
                name: 'departmentId',
                type: 'string',
                default: '',
                required: true,
                description: 'The default Department ID for ticket creation',
            },
            {
                displayName: 'Zoho Region',
                name: 'region',
                type: 'options',
                options: [
                    { name: 'Global (US)', value: 'com' },
                    { name: 'India', value: 'in' },
                    { name: 'Europe', value: 'eu' },
                    { name: 'China', value: 'com.cn' },
                    { name: 'Australia', value: 'com.au' },
                ],
                default: 'com',
                description: 'The Zoho datacenter region to use',
            },
        ];
    }
}
exports.ZohoDeskSelfClientApi = ZohoDeskSelfClientApi;
//# sourceMappingURL=ZohoDeskSelfClientApi.credentials.js.map