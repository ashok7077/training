"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZohoDesk = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class ZohoDesk {
    constructor() {
        this.description = {
            displayName: 'Zoho Desk',
            name: 'zohoDesk',
            icon: 'file:zohoDesk.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
            description: 'Interact with Zoho Desk API',
            defaults: { name: 'Zoho Desk' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{ name: 'zohoDeskSelfClient-Api', required: true }],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Get Tickets',
                            value: 'getTickets',
                            description: 'Retrieve tickets',
                            action: 'Retrieve tickets',
                        },
                        {
                            name: 'Send Ticket',
                            value: 'sendTicket',
                            description: 'Create a new ticket',
                            action: 'Create a new ticket',
                        },
                    ],
                    default: 'getTickets',
                },
                {
                    displayName: 'Override Contact ID',
                    name: 'overrideContactId',
                    type: 'boolean',
                    default: false,
                    displayOptions: { show: { operation: ['sendTicket'] } },
                    description: 'Whether to override the default Contact ID from credentials',
                },
                {
                    displayName: 'Contact ID',
                    name: 'contactId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['sendTicket'],
                            overrideContactId: [true],
                        },
                    },
                    description: 'The Contact ID of the user creating the ticket',
                },
                {
                    displayName: 'Override Department ID',
                    name: 'overrideDepartmentId',
                    type: 'boolean',
                    default: false,
                    displayOptions: { show: { operation: ['sendTicket'] } },
                    description: 'Whether to override the default Department ID from credentials',
                },
                {
                    displayName: 'Department ID',
                    name: 'departmentId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['sendTicket'],
                            overrideDepartmentId: [true],
                        },
                    },
                    description: 'The Department ID where the ticket should be assigned',
                },
                {
                    displayName: 'Subject',
                    name: 'subject',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: { show: { operation: ['sendTicket'] } },
                    description: 'Subject of the ticket',
                },
                {
                    displayName: 'Description',
                    name: 'description',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: { show: { operation: ['sendTicket'] } },
                    description: 'Details about the issue',
                },
                {
                    displayName: 'Priority',
                    name: 'priority',
                    type: 'options',
                    options: [
                        {
                            name: 'Low',
                            value: 'Low',
                        },
                        {
                            name: 'Medium',
                            value: 'Medium',
                        },
                        {
                            name: 'High',
                            value: 'High',
                        },
                        {
                            name: 'Urgent',
                            value: 'Urgent',
                        },
                    ],
                    default: 'Medium',
                    displayOptions: { show: { operation: ['sendTicket'] } },
                    description: 'Priority level of the ticket',
                },
            ],
        };
    }
    async execute() {
        console.log('🔹 [Zoho Node] Starting execution');
        const returnData = [];
        let accessToken;
        try {
            const credentials = await this.getCredentials('zohoDeskSelfClient-Api');
            console.log('🔹 [Zoho Node] Retrieved Credentials');
            if (!credentials) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'No credentials found for ZohoDeskSelfClient-Api.' });
            }
            console.log('🔹 [Zoho Node] Requesting new access token using refresh token...');
            const tokenUrl = `https://accounts.zoho.${credentials.region}/oauth/v2/token`;
            const tokenResponse = await this.helpers.request({
                method: 'POST',
                url: tokenUrl,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                form: {
                    client_id: credentials.clientId,
                    client_secret: credentials.clientSecret,
                    refresh_token: credentials.refreshToken,
                    grant_type: 'refresh_token',
                },
                resolveWithFullResponse: true,
            });
            if (!tokenResponse.body) {
                console.error('❌ [Zoho Node] Empty response from token endpoint');
                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'Empty response from token endpoint' });
            }
            let tokenData;
            try {
                tokenData = JSON.parse(tokenResponse.body);
            }
            catch (e) {
                console.error('❌ [Zoho Node] Failed to parse token response:', tokenResponse.body);
                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'Invalid token response format' });
            }
            if (!tokenData.access_token) {
                console.error('❌ [Zoho Node] No access token in response:', tokenData);
                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'No access token received' });
            }
            accessToken = tokenData.access_token;
            console.log('✅ [Zoho Node] Successfully obtained new access token');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                orgId: credentials.orgId,
            };
            console.log('✅ [Zoho Node] Headers Set');
            const operation = this.getNodeParameter('operation', 0);
            if (operation === 'getTickets') {
                const options = {
                    method: 'GET',
                    headers,
                    url: `https://desk.zoho.${credentials.region}/api/v1/tickets`,
                };
                console.log('🔹 [Zoho Node] Fetching tickets...');
                const responseData = await this.helpers.request(options);
                console.log('✅ [Zoho Node] Successfully retrieved tickets');
                returnData.push({ json: responseData });
            }
            if (operation === 'sendTicket') {
                const overrideContactId = this.getNodeParameter('overrideContactId', 0);
                const overrideDepartmentId = this.getNodeParameter('overrideDepartmentId', 0);
                const contactId = overrideContactId
                    ? this.getNodeParameter('contactId', 0)
                    : credentials.contactId;
                const departmentId = overrideDepartmentId
                    ? this.getNodeParameter('departmentId', 0)
                    : credentials.departmentId;
                const subject = this.getNodeParameter('subject', 0);
                const description = this.getNodeParameter('description', 0);
                const priority = this.getNodeParameter('priority', 0);
                if (!contactId || !departmentId || !subject) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), '❌ Missing required parameters for ticket creation.');
                }
                const body = {
                    contactId,
                    departmentId,
                    subject,
                    description,
                    priority,
                };
                const options = {
                    method: 'POST',
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    url: `https://desk.zoho.${credentials.region}/api/v1/tickets`,
                    body,
                    json: true,
                };
                console.log('🔹 [Zoho Node] Creating ticket...');
                console.log('🔹 [Zoho Node] Ticket Details:', {
                    contactId,
                    departmentId,
                    subject,
                    priority,
                    usingOverrideContact: overrideContactId,
                    usingOverrideDepartment: overrideDepartmentId,
                });
                const responseData = await this.helpers.request(options);
                console.log('✅ [Zoho Node] Ticket created successfully');
                returnData.push({ json: responseData });
            }
        }
        catch (error) {
            console.error('❌ [Zoho Node] Operation failed:', error.message || error);
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { message: `Zoho API Error: ${error.message || 'Unknown error occurred'}` });
        }
        return [returnData];
    }
}
exports.ZohoDesk = ZohoDesk;
//# sourceMappingURL=ZohoDesk.node.js.map