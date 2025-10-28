import React, { useState } from 'react';
import { Download, Play, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Calendar, User } from 'lucide-react';

const EchoHalalTestCases = () => {
  const [activeTab, setActiveTab] = useState('authorization');
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [testExecutions, setTestExecutions] = useState({});
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [executionData, setExecutionData] = useState({
    status: '',
    actualResult: '',
    comments: '',
    executedBy: '',
    executionTime: ''
  });

  const testCases = {
    authorization: [
      {
        id: 'TC-EH-01',
        scenario: 'Verify successful authorization with valid credentials',
        endpoint: 'BaseUrl/be-smart-cert/aum-smart-cert/1.0/public/v1/external/authorization/token',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'Valid ID and Secret Key available.',
        testSteps: [
          'Send a POST request to the authorization endpoint',
          'Include a valid Id and Secret Key in the request body',
          'Verify response status code',
          'Verify the authorization token is returned',
          'Validate token format and expiry'
        ],
        testData: {
          id: 'echo-testing',
          secret: '2b2432d3-3f58-46f1-840c-312e656208ee',
          contentType: 'application/json',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 200\nResponse contains valid authorization token\nToken format is correct (JWT)\nToken expiry is set appropriately',
        postConditions: 'Authorization token can be used for subsequent API calls',
        estimatedTime: '5 mins',
        tags: ['Smoke', 'Regression', 'API']
      },
      {
        id: 'TC-EH-02',
        scenario: 'Verify authorization fails with invalid credentials',
        endpoint: 'BaseUrl/be-smart-cert/aum-smart-cert/1.0/public/v1/external/authorization/token',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'Invalid user credentials.',
        testSteps: [
          'Send a POST request to the /authorization endpoint',
          'Include invalid Id and Secret Key in the request body',
          'Verify response status code',
          'Verify the appropriate error message'
        ],
        testData: {
          id: 'echo-testing1',
          secret: '2b2432d3-3f58-46f1-840c-312e65620',
          contentType: 'application/json',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 401\nError message: Unauthorized or Invalid credentials\nNo token is returned',
        postConditions: 'No token is generated',
        estimatedTime: '3 mins',
        tags: ['Regression', 'API', 'Security']
      },
      {
        id: 'TC-EH-03',
        scenario: 'Verify authorization fails with missing credentials',
        endpoint: 'BaseUrl/be-smart-cert/aum-smart-cert/1.0/public/v1/external/authorization/token',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'Empty request body.',
        testSteps: [
          'Send a POST request without credentials',
          'Verify response status code',
          'Verify error message indicates missing fields'
        ],
        testData: {
          id: '',
          secret: '',
          contentType: 'application/json',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message indicates required fields are missing',
        postConditions: 'No token is generated',
        estimatedTime: '3 mins',
        tags: ['Regression', 'API']
      }
    ],

    signDocument: [
      {
        id: 'TC-EH-04',
        scenario: 'Sign the Halal Certificate with a valid file',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid Halal certificate file is available\nSet the proper access token in the authorization.',
        testSteps: [
          'Obtain the authorization token',
          'Prepare valid Halal certificate PDF file',
          'Send a POST request with the file',
          'Include the authorization token in the header',
          'Verify response status',
          'Verify the signature is applied to the document'
        ],
        testData: {
          file: 'halal_certificate.pdf',
          fileSize: '2.5 MB',
          fileFormat: 'PDF',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 200\nDocument signed successfully\nSigned document returned or reference ID provided\nDigital signature is visible and valid',
        postConditions: 'Document is digitally signed and stored',
        estimatedTime: '8 mins',
        tags: ['Smoke', 'Regression', 'API', 'Halal']
      },
      {
        id: 'TC-EH-05',
        scenario: 'Sign the Health Certificate with a valid file',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid Health certificate file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare valid Health certificate PDF file',
          'Send a POST request with the file',
          'Include the authorization token in the header',
          'Verify response status',
          'Verify the signature is applied to the document'
        ],
        testData: {
          file: 'health_certificate.pdf',
          fileSize: '3.1 MB',
          fileFormat: 'PDF',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 200\nDocument signed successfully\nSigned document returned or reference ID provided',
        postConditions: 'Document is digitally signed and stored',
        estimatedTime: '8 mins',
        tags: ['Smoke', 'Regression', 'API', 'Health']
      },
      {
        id: 'TC-EH-06',
        scenario: 'Sign the Origin Certificate with a valid file',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid Origin certificate file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare valid Origin certificate PDF file',
          'Send a POST request with the file',
          'Include the authorization token in the header',
          'Verify response status',
          'Verify the signature is applied to the document'
        ],
        testData: {
          file: 'origin_certificate.pdf',
          fileSize: '3.1 MB',
          fileFormat: 'PDF',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 200\nDocument signed successfully\nSigned document returned or reference ID provided',
        postConditions: 'Document is digitally signed and stored',
        estimatedTime: '8 mins',
        tags: ['Smoke', 'Regression', 'API', 'Origin']
      },
      {
        id: 'TC-EH-07',
        scenario: 'Sign the Invoice Certificate with a valid file',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid Invoice certificate file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare valid Invoice certificate PDF file',
          'Send a POST request with the file',
          'Include the authorization token in the header',
          'Verify response status',
          'Verify the signature is applied to the document'
        ],
        testData: {
          file: 'invoice_certificate.pdf',
          fileSize: '3.1 MB',
          fileFormat: 'PDF',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 200\nDocument signed successfully\nSigned document returned or reference ID provided',
        postConditions: 'Document is digitally signed and stored',
        estimatedTime: '8 mins',
        tags: ['Smoke', 'Regression', 'API', 'Invoice']
      },
      {
        id: 'TC-EH-08',
        scenario: 'Sign the Additional Document with a valid file',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid Additional Document file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare valid Additional Document PDF file',
          'Send a POST request with the file',
          'Include the authorization token in the header',
          'Verify response status',
          'Verify the signature is applied to the document'
        ],
        testData: {
          file: 'additional_document.pdf',
          fileSize: '3.1 MB',
          fileFormat: 'PDF',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 200\nDocument signed successfully\nSigned document returned or reference ID provided',
        postConditions: 'Document is digitally signed and stored',
        estimatedTime: '8 mins',
        tags: ['Smoke', 'Regression', 'API', 'Additional Document']
      },
      {
        id: 'TC-EH-09',
        scenario: 'Sign the Halal Certificate with an invalid file format | PNG.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'halal.png',
          fileSize: '1.2 MB',
          fileFormat: 'PNG (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      {
        id: 'TC-EH-10',
        scenario: 'Sign the Halal Certificate with an invalid file format | DOC.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'halal.doc',
          fileSize: '1.2 MB',
          fileFormat: 'DOC (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      {
        id: 'TC-EH-11',
        scenario: 'Sign the Halal Certificate with an invalid file format | XLS.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'halal.xls',
          fileSize: '1.2 MB',
          fileFormat: 'XLS (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      {
        id: 'TC-EH-12',
        scenario: 'Sign the Health Certificate with an invalid file format | PNG.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'health.png',
          fileSize: '1.2 MB',
          fileFormat: 'PNG (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      {
        id: 'TC-EH-13',
        scenario: 'Sign the Health Certificate with an invalid file format | DOC.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'halal.doc',
          fileSize: '1.2 MB',
          fileFormat: 'DOC (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      {
        id: 'TC-EH-14',
        scenario: 'Sign the Health Certificate with an invalid file format | XLS.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'halal.xls',
          fileSize: '1.2 MB',
          fileFormat: 'XLS (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },

      {
        id: 'TC-EH-15',
        scenario: 'Sign the Orign Certificate with an invalid file format | PNG.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'Orign.png',
          fileSize: '1.2 MB',
          fileFormat: 'PNG (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      {
        id: 'TC-EH-16',
        scenario: 'Sign the Orign Certificate with an invalid file format | DOC.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'Orign.doc',
          fileSize: '1.2 MB',
          fileFormat: 'DOC (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      {
        id: 'TC-EH-17',
        scenario: 'Sign the Orign Certificate with an invalid file format | XLS.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'Orign.xls',
          fileSize: '1.2 MB',
          fileFormat: 'XLS (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },

      {
        id: 'TC-EH-18',
        scenario: 'Sign the Invoice Certificate with an invalid file format | PNG.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'Invoice.png',
          fileSize: '1.2 MB',
          fileFormat: 'PNG (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      {
        id: 'TC-EH-19',
        scenario: 'Sign the Invoice Certificate with an invalid file format | DOC.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'Invoice.doc',
          fileSize: '1.2 MB',
          fileFormat: 'DOC (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      {
        id: 'TC-EH-20',
        scenario: 'Sign the Invoice Certificate with an invalid file format | XLS.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'Invoice.xls',
          fileSize: '1.2 MB',
          fileFormat: 'XLS (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },


      {
        id: 'TC-EH-21',
        scenario: 'Sign the Additional Document with an invalid file format | PNG.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'Additional-Document.png',
          fileSize: '1.2 MB',
          fileFormat: 'PNG (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      {
        id: 'TC-EH-22',
        scenario: 'Sign the Additional Document with an invalid file format | DOC.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'Additional Document.doc',
          fileSize: '1.2 MB',
          fileFormat: 'DOC (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      {
        id: 'TC-EH-23',
        scenario: 'Sign the Additional Document with an invalid file format | XLS.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/sign',
        method: 'POST',
        priority: 'High',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid/corrupted file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare invalid or corrupted file',
          'Send a POST request with the invalid file',
          'Include the authorization token in the header',
          'Verify error response'
        ],
        testData: {
          file: 'Additional-Document.xls',
          fileSize: '1.2 MB',
          fileFormat: 'XLS (corrupted)',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.\nNo signature is applied',
        postConditions: 'Document is not signed',
        estimatedTime: '5 mins',
        tags: ['Regression', 'API', 'Negative']
      },
      
    ],
    uploadDocument: [
      {
        id: 'TC-EH-14',
        scenario: 'Upload Halal certificate with a valid signature and file',
        endpoint: 'BaseUrl/be-smart-cert/aum-smart-cert/1.0/public/v1/external/halal/upload',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid signed PDF file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare signed Halal certificate PDF',
          'Send a POST request with the signed file',
          'Include the proper content-type header',
          'Verify upload success',
          'Verify file reference ID is returned'
        ],
        testData: {
          file: 'signed_halal.pdf',
          fileSize: '4.5 MB',
          fileFormat: 'PDF',
          signature: 'Digital Signature Applied',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 200 or 201\nFile uploaded successfully\nFile ID or reference returned\nFile can be retrieved using the reference ID',
        postConditions: 'File is stored in the system and accessible',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },
      {
        id: 'TC-EH-15',
        scenario: 'Upload Health certificate with a valid signature and file',
        endpoint: 'BaseUrl/be-smart-cert/aum-smart-cert/1.0/public/v1/external/health/upload',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid signed PDF file is available',
        testSteps: [
          'Obtain the authorization token',
          'Prepare signed Health certificate PDF',
          'Send a POST request with the signed file',
          'Include the proper content-type header',
          'Verify upload success',
          'Verify file reference ID is returned'
        ],
        testData: {
          file: 'signed_health.pdf',
          fileSize: '5.2 MB',
          fileFormat: 'PDF',
          signature: 'Digital Signature Applied',
          authToken: 'Bearer {token}',
          contentType: 'multipart/form-data',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 200 or 201\nFile uploaded successfully\nFile ID or reference returned',
        postConditions: 'File is stored in the system and accessible',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      }
    ],
    createCertificates: [
      {
        id: 'TC-EH-16',
        scenario: 'Create all certificates with valid format',
        endpoint: 'BaseUrl/be-smart-cert/aum-smart-cert/1.0/public/v1/external/create-certificates',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nAll required certificate data available',
        testSteps: [
          'Obtain authorization token',
          'Prepare valid data for all certificate types (Halal, Health, Origin, Invoice)',
          'Send POST request with complete certificate data',
          'Verify response status code',
          'Verify all certificates are created',
          'Verify response contains all certificate IDs',
          'Validate certificate data integrity'
        ],
        testData: {
          halalCert: {
            importerName: 'ABC Trading Co',
            exporterName: 'XYZ Exports Ltd',
            productDescription: 'Halal Chicken',
            quantity: '1000 KG',
            destination: 'Dubai, UAE'
          },
          healthCert: {
            importerName: 'ABC Trading Co',
            exporterName: 'XYZ Exports Ltd',
            productDescription: 'Fresh Vegetables',
            quantity: '500 KG',
            healthStandards: 'ISO 22000'
          },
          originCert: {
            country: 'Pakistan',
            manufacturer: 'XYZ Exports Ltd',
            productCode: 'PRD-001'
          },
          invoiceCert: {
            invoiceNumber: 'INV-2024-001',
            totalAmount: '50000 USD',
            currency: 'USD'
          },
          authToken: 'Bearer {token}',
          contentType: 'application/json',
          environment: 'QA'
        },
        expectedResult: 'Status Code: 200 or 201\nAll certificates created successfully\nResponse contains IDs for all certificates\nEach certificate can be retrieved individually',
        postConditions: 'All certificates are stored and accessible',
        estimatedTime: '15 mins',
        tags: ['Smoke', 'Regression', 'API', 'E2E']
      }
    ]
  };

  const tabs = [
    { key: 'authorization', label: 'Authorization', count: testCases.authorization.length },
    { key: 'signDocument', label: 'Sign Document', count: testCases.signDocument.length },
    { key: 'uploadDocument', label: 'Upload Document', count: testCases.uploadDocument.length },
    { key: 'createCertificates', label: 'Create Certificates', count: testCases.createCertificates.length }
  ];

  const handleExecuteTest = (testCaseId) => {
    setSelectedTestCase(testCaseId);
    setShowExecutionModal(true);
    setExecutionData({
      status: '',
      actualResult: '',
      comments: '',
      executedBy: '',
      executionTime: new Date().toISOString().split('T')[0]
    });
  };

  const handleSaveExecution = () => {
    setTestExecutions({
      ...testExecutions,
      [selectedTestCase]: {
        ...executionData,
        timestamp: new Date().toISOString()
      }
    });
    setShowExecutionModal(false);
    setSelectedTestCase(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Failed':
        return <XCircle className="text-red-600" size={20} />;
      case 'Blocked':
        return <AlertTriangle className="text-yellow-600" size={20} />;
      case 'In Progress':
        return <Clock className="text-blue-600" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Passed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Failed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Blocked':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const downloadCSV = () => {
    const headers = ['Test Case ID', 'Test Scenario', 'API Endpoint', 'HTTP Method', 'Priority', 'Type', 'Automation Status', 'Pre-Conditions', 'Test Steps', 'Test Data', 'Expected Result', 'Post-Conditions', 'Estimated Time', 'Tags', 'Execution Status', 'Executed By', 'Execution Date'];
    
    let csvContent = headers.join(',') + '\n';
    
    Object.values(testCases).flat().forEach(tc => {
      const execution = testExecutions[tc.id] || {};
      const row = [
        tc.id,
        `"${tc.scenario}"`,
        tc.endpoint,
        tc.method,
        tc.priority,
        tc.type,
        tc.automationStatus,
        `"${tc.preConditions}"`,
        `"${tc.testSteps.join(' | ')}"`,
        `"${JSON.stringify(tc.testData).replace(/"/g, "'")}"`,
        `"${tc.expectedResult.replace(/\n/g, ' ')}"`,
        `"${tc.postConditions}"`,
        tc.estimatedTime,
        tc.tags.join('; '),
        execution.status || 'Not Executed',
        execution.executedBy || '',
        execution.executionTime || ''
      ];
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'ECHO_Halal_Test_Cases.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentTestCases = testCases[activeTab];
  const selectedTC = currentTestCases.find(tc => tc.id === selectedTestCase);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ECHO Halal Certificate - Test Management</h1>
              <p className="text-sm text-gray-600 mt-1">Test Case Repository & Execution Tracking</p>
            </div>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Download size={18} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-gray-900">{Object.values(testCases).flat().length}</div>
            <div className="text-xs text-gray-600 mt-1">Total Cases</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(testExecutions).filter(e => e.status === 'Passed').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Passed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="text-2xl font-bold text-red-600">
              {Object.values(testExecutions).filter(e => e.status === 'Failed').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Failed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">
              {Object.values(testExecutions).filter(e => e.status === 'Blocked').length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Blocked</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
            <div className="text-2xl font-bold text-gray-600">
              {Object.values(testCases).flat().length - Object.keys(testExecutions).length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Not Executed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-lg shadow overflow-hidden">
          <div className="flex border-b">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.key ? 'bg-white bg-opacity-30' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Test Cases Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Scenario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentTestCases.map((tc, index) => {
                  const execution = testExecutions[tc.id];
                  return (
                    <tr key={tc.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer`}
                      onClick={() => setSelectedTestCase(tc.id)}>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{tc.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{tc.scenario}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          tc.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                          tc.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tc.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          tc.type === 'Functional' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {tc.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {execution ? (
                          <div className="flex items-center gap-2">
                            {getStatusIcon(execution.status)}
                            <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(execution.status)}`}>
                              {execution.status}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Not Executed</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{tc.estimatedTime}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExecuteTest(tc.id);
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                        >
                          <Play size={14} />
                          Execute
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Case Details */}
        {selectedTestCase && (
          <div className="bg-white rounded-b-lg shadow-lg p-6 mt-0 border-t-4 border-blue-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="text-blue-600" size={24} />
                Test Case Details - {selectedTestCase}
              </h3>
              <div className="flex items-center gap-2">
                {selectedTC?.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Scenario</label>
                  <p className="text-sm text-gray-800 mt-1">{selectedTC?.scenario}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Priority</label>
                    <p className="text-sm text-gray-800 mt-1">{selectedTC?.priority}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                    <p className="text-sm text-gray-800 mt-1">{selectedTC?.type}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">API Endpoint</label>
                  <p className="text-xs text-gray-800 mt-1 font-mono bg-gray-50 p-2 rounded">{selectedTC?.endpoint}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Pre-Conditions</label>
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">{selectedTC?.preConditions}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Test Steps</label>
                  <ol className="mt-2 space-y-1">
                    {selectedTC?.testSteps.map((step, idx) => (
                      <li key={idx} className="text-sm text-gray-800 flex gap-2">
                        <span className="font-semibold text-blue-600">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Test Data</label>
                  <div className="mt-2 bg-gray-50 p-3 rounded text-xs font-mono">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(selectedTC?.testData, null, 2)}</pre>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Expected Result</label>
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-line bg-green-50 p-3 rounded border border-green-200">
                    {selectedTC?.expectedResult}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Post-Conditions</label>
                  <p className="text-sm text-gray-800 mt-1">{selectedTC?.postConditions}</p>
                </div>

                {/* Execution History */}
                {testExecutions[selectedTestCase] && (
                  <div className="border-t pt-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Last Execution</label>
                    <div className="mt-2 bg-gray-50 p-3 rounded space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold w-24">Status:</label>
                        <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(testExecutions[selectedTestCase].status)}`}>
                          {testExecutions[selectedTestCase].status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-500" />
                        <span className="text-xs text-gray-700">{testExecutions[selectedTestCase].executedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        <span className="text-xs text-gray-700">{testExecutions[selectedTestCase].executionTime}</span>
                      </div>
                      {testExecutions[selectedTestCase].comments && (
                        <div className="mt-2">
                          <label className="text-xs font-semibold text-gray-500">Comments:</label>
                          <p className="text-xs text-gray-700 mt-1">{testExecutions[selectedTestCase].comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Execution Modal */}
      {showExecutionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Execute Test Case - {selectedTestCase}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Execution Status *</label>
                <select
                  value={executionData.status}
                  onChange={(e) => setExecutionData({ ...executionData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                  <option value="Blocked">Blocked</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Actual Result</label>
                <textarea
                  value={executionData.actualResult}
                  onChange={(e) => setExecutionData({ ...executionData, actualResult: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter actual result..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Comments</label>
                <textarea
                  value={executionData.comments}
                  onChange={(e) => setExecutionData({ ...executionData, comments: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add any comments or observations..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Executed By *</label>
                  <input
                    type="text"
                    value={executionData.executedBy}
                    onChange={(e) => setExecutionData({ ...executionData, executedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tester name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Execution Date *</label>
                  <input
                    type="date"
                    value={executionData.executionTime}
                    onChange={(e) => setExecutionData({ ...executionData, executionTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowExecutionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExecution}
                disabled={!executionData.status || !executionData.executedBy}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Save Execution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EchoHalalTestCases;