import React, { useState } from 'react';
import { Download, Play, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Calendar, User, Search, BookOpen, ChevronsRight } from 'lucide-react';
import createAllCertsPayload from './testData/createAllCerts.json';
import invalidDestionPortPayload from './testData/invalidDestinationPort.json';
import invalidLoadingPortPayload from './testData/invalidLoadingPort.json';
import { testStrategy } from './testData/testStrategy';

const TestStrategyViewer = () => (
    <div className="bg-white rounded-xl shadow p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <BookOpen className="text-blue-600" />
        <span>{testStrategy.title}</span>
      </h1>
      {testStrategy.sections.map((section, index) => (
        <div key={index} className="mb-8 pb-4 border-b last:border-b-0">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">{section.title}</h2>
          {Array.isArray(section.content) ? (
            <ul className="space-y-2 text-sm text-gray-600">
              {section.content.map((item, i) => <li key={i} className="flex items-start"><ChevronsRight className="w-4 h-4 mr-2 mt-1 text-blue-500 flex-shrink-0" /> <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></li>)}
            </ul>
          ) : (
            section.content && <p className="text-sm text-gray-600">{section.content}</p>
          )}
          {section.subsections && (
            <div className="mt-4 space-y-4 pl-4">
              {section.subsections.map((subsection, subIndex) => (
                <div key={subIndex}>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{subsection.title}</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {subsection.content.map((item, i) => <li key={i} className="flex items-start"><ChevronsRight className="w-4 h-4 mr-2 mt-1 text-blue-500 flex-shrink-0" /> <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('testCases');

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
        scenario: 'Sign the Halal Certificate with a valid file | PDF',
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
        scenario: 'Sign the Health Certificate with a valid file | PDF',
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
        scenario: 'Sign the Origin Certificate with a valid file | PDF',
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
        scenario: 'Sign the Invoice Certificate with a valid file | PDF',
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
        scenario: 'Sign the Additional Document with a valid file | PDF',
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
        id: 'TC-EH-24',
        scenario: 'Upload Halal Certificate with a valid signature and file format | PDF',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid signed PDF file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_halal.pdf (upload PDF Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Halal Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: `Status Code: 200
        Response Body:
        {
            "id": 19796,
            "referenceId": "0c9dbfa5-499f-471d-8214-db61",
            "fileName": "Halal-Cert.pdf",
            "fileSize": 276764,
            "fileType": "Halal Certificate",
            "mime": "application/pdf",
            "eventType": "ISSUING_CERTIFICATE",
            "eventId": "b5cf08bf-2983-4648-85f7"
        }

        Validations:
        - File uploaded successfully
        - File ID or reference returned
        - File can be retrieved using the reference ID
        - File size matches uploaded file
        - File type is correctly set`,
        postConditions: 'File is stored in the system and accessible',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-25',
        scenario: 'Upload Health Certificate with a valid signature and file format | PDF.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid signed PDF file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_health.pdf (upload PDF Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Health Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: `Status Code: 200
        Response Body:
        {
            "id": 19796,
            "referenceId": "0c9dbfa5-499f-471d-8214-db61",
            "fileName": "Health-Cert.pdf",
            "fileSize": 276764,
            "fileType": "Health Certificate",
            "mime": "application/pdf",
            "eventType": "ISSUING_CERTIFICATE",
            "eventId": "b5cf08bf-2983-4648-85f7"
        }

        Validations:
        - File uploaded successfully
        - File ID or reference returned
        - File can be retrieved using the reference ID
        - File size matches uploaded file
        - File type is correctly set`,
        postConditions: 'File is stored in the system and accessible',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-26',
        scenario: 'Upload Origin Certificate with a valid signature and file format | PDF.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid signed PDF file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_origin.pdf (upload PDF Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Origin Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: `Status Code: 200
        Response Body:
        {
            "id": 19796,
            "referenceId": "0c9dbfa5-499f-471d-8214-db61",
            "fileName": "Health-Cert.pdf",
            "fileSize": 276764,
            "fileType": "COMMON_FILE",
            "mime": "application/pdf",
            "eventType": "ISSUING_CERTIFICATE",
            "eventId": "b5cf08bf-2983-4648-85f7"
        }

        Validations:
        - File uploaded successfully
        - File ID or reference returned
        - File can be retrieved using the reference ID
        - File size matches uploaded file
        - File type is correctly set`,
        postConditions: 'File is stored in the system and accessible',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-27',
        scenario: 'Upload Invoice Certificate with a valid signature and file format | PDF.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid signed PDF file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_invoice.pdf (upload PDF Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Invoice Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: `Status Code: 200
        Response Body:
        {
            "id": 19796,
            "referenceId": "0c9dbfa5-499f-471d-8214-db61",
            "fileName": "Invoice-Cert.pdf",
            "fileSize": 276764,
            "fileType": "COMMON_FILE",
            "mime": "application/pdf",
            "eventType": "ISSUING_CERTIFICATE",
            "eventId": "b5cf08bf-2983-4648-85f7"
        }

        Validations:
        - File uploaded successfully
        - File ID or reference returned
        - File can be retrieved using the reference ID
        - File size matches uploaded file
        - File type is correctly set`,
        postConditions: 'File is stored in the system and accessible',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-28',
        scenario: 'Upload Additional Document with a valid signature and file format | PDF.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Functional',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nValid signed PDF file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'addition_doc.pdf (upload PDF Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Additional Document'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: `Status Code: 200
        Response Body:
        {
            "id": 19796,
            "referenceId": "0c9dbfa5-499f-471d-8214-db61",
            "fileName": "billing-doc-ecert.pdf",
            "fileSize": 276764,
            "fileType": "Bill of Loading",
            "mime": "application/pdf",
            "eventType": "ISSUING_CERTIFICATE",
            "eventId": "b5cf08bf-2983-4648-85f7"
        }

        Validations:
        - File uploaded successfully
        - File ID or reference returned
        - File can be retrieved using the reference ID
        - File size matches uploaded file
        - File type is correctly set`,
        postConditions: 'File is stored in the system and accessible',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-29',
        scenario: 'Upload Halal Certificate with a valid signature and invalid file format | PNG.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid PNG file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_halal.png (upload PNG Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Halal Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-30',
        scenario: 'Upload Halal Certificate with a valid signature and invalid file format | DOC.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid Doc file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_halal.doc (upload DOC Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Halal Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },
      {
        id: 'TC-EH-31',
        scenario: 'Upload Halal Certificate with a valid signature and invalid file format | XLS.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid XLS file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_halal.xls (upload XLS Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Halal Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-32',
        scenario: 'Upload Health Certificate with a valid signature and invalid file format | PNG.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid PNG file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_health.png (upload PNG Cert file)',
            signature: 'signature value got from the signed document api',
            fileType: 'Health Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-33',
        scenario: 'Upload Health Certificate with a valid signature and invalid file format | DOC.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid Doc file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Health Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_health.doc (upload DOC Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Health Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },
      {
        id: 'TC-EH-34',
        scenario: 'Upload Health Certificate with a valid signature and invalid file format | XLS.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid XLS file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Health Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_health.xls (upload XLS Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Health Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-35',
        scenario: 'Upload Origin Certificate with a valid signature and invalid file format | PNG.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid PNG file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_origin.png (upload PNG Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Origin Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-36',
        scenario: 'Upload Origin Certificate with a valid signature and invalid file format | DOC.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid Doc file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Origin Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_origin.doc (upload DOC Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Origin Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },
      {
        id: 'TC-EH-37',
        scenario: 'Upload Origin Certificate with a valid signature and invalid file format | XLS.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid XLS file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Origin Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_origin.xls (upload XLS Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Origin Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-38',
        scenario: 'Upload Invoice Certificate with a valid signature and invalid file format | PNG.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid PNG file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Invoice Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_invoice.png (upload PNG Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Invoice Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-39',
        scenario: 'Upload Invoice Certificate with a valid signature and invalid file format | DOC.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid Doc file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Invoice Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_invoice.doc (upload DOC Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Invoice Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },
      {
        id: 'TC-EH-40',
        scenario: 'Upload Invoice Certificate with a valid signature and invalid file format | XLS.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInvalid XLS file is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Invoice Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_invoice.xls (upload XLS Cert file)',
            signature: 'Signature value got from the signed document api',
            fileType: 'Invoice Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Unsupported file type. Only PDF files are allowed.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

       {
        id: 'TC-EH-41',
        scenario: 'Upload Halal Certificate with a invalid signature and valid file format | PDF.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInValid File Signature is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_halal.pdf (upload PDF Cert file)',
            signature: 'Invalid signature value',
            fileType: 'Halal Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Failed to verify signature.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-42',
        scenario: 'Upload Health Certificate with a invalid signature and valid file format | PDF.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInValid File Signature is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_health.pdf (upload PDF Cert file)',
            signature: 'Invalid signature value',
            fileType: 'Health Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Failed to verify signature.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-43',
        scenario: 'Upload Origin Certificate with a invalid signature and valid file format | PDF.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInValid File Signature is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_origin.pdf (upload PDF Cert file)',
            signature: 'Invalid signature value',
            fileType: 'Origin Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Failed to verify signature.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-44',
        scenario: 'Upload Invoice Certificate with a invalid signature and valid file format | PDF.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInValid File Signature is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'signed_invoice.pdf (upload PDF Cert file)',
            signature: 'Invalid signature value',
            fileType: 'Invoice Certificate'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Failed to verify signature.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },

      {
        id: 'TC-EH-45',
        scenario: 'Upload additional document with a invalid signature and valid file format | PDF.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/file/upload-with-sign',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
        automationStatus: 'Automated',
        preConditions: 'User is authorized\nInValid File Signature is available',
        testSteps: [
          'Obtain an authorization token.',
          'Send a POST request with a signed Halal Cert PDF.' ,
          'Include proper content-type header.' ,
          'Verify upload success.',
          'Define signature and filetype values in the request body.',
          'Define eventId, eventType, and issueEntity values in parameters.'

        ],
        testData: {
          body: {
            file: 'additional_document.pdf (upload PDF Cert file)',
            signature: 'Invalid signature value',
            fileType: 'Additional Document'
          },
          params: {
            eventId: 'EVT-12345',
            eventType: 'CERTIFICATE_FILE_TYPE',
            issuingEntity: 'FAMBRAS HALAL Certification Limited'
          }
        },
        expectedResult: 'Status Code: 400\nError message: Failed to verify signature.',
        postConditions: 'File is not uploaded',
        estimatedTime: '10 mins',
        tags: ['Smoke', 'Regression', 'API', 'Upload']
      },
    ],

    createCertificates: [
      {
        id: 'TC-EH-46',
        scenario: 'Create all Certificates with valid format | Halal, Health, Origin, Invoice.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/certificate-details',
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
          body: createAllCertsPayload,
          headers: {
          authorization: 'Bearer {token}',
          contentType: 'application/json'
          },
        },
        
        expectedResult: 'Status Code: 200\nGenerate Certificate Request\nId": 114605\nStatus: SENT',
        postConditions: 'All certificates are stored and accessible',
        estimatedTime: '15 mins',
        tags: ['Smoke', 'Regression', 'API', 'E2E']
      },

      {
        id: 'TC-EH-47',
        scenario: 'Create all Certificates with invalid Destination Port | Halal, Health, Origin, Invoice.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/certificate-details',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
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
          body: invalidDestionPortPayload,
          headers: {
          authorization: 'Bearer {token}',
          contentType: 'application/json'
          },
        },
        
        expectedResult: 'Status Code: 400\nDestination ports should be same for the given certificates :[Ajman, Ajman, Ajman Port, Ajman Port]',
        postConditions: 'All certificates are stored and accessible',
        estimatedTime: '15 mins',
        tags: ['Smoke', 'Regression', 'API', 'E2E']
      },

      {
        id: 'TC-EH-48',
        scenario: 'Create all Certificates with invalid Loading Port | Halal, Health, Origin, Invoice.',
        endpoint: 'BaseUrl/be-smart-cert/core-smart-cert/1.0/api/v1/facilitator/certificate-details',
        method: 'POST',
        priority: 'Critical',
        type: 'Negative',
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
          body: invalidLoadingPortPayload,
          headers: {
          authorization: 'Bearer {token}',
          contentType: 'application/json'
          },
        },
        
        expectedResult: 'Status Code: 400\nInvalid loading port. Please select a valid loading port for the FAMBRAS HALAL Certification Limited authority.',
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

  const filteredTestCases = testCases[activeTab].filter(tc =>
    tc.scenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTC = testCases[activeTab].find(tc => tc.id === selectedTestCase);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h1 className="text-xl font-bold text-gray-800">ECHO Halal Certificate - Test Management</h1>
                <p className="text-xs text-gray-500">Test Case Repository & Execution Tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by ID or scenario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <button
                onClick={downloadCSV}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all text-sm font-medium shadow-md hover:shadow-lg"
              >
                <Download size={16} />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Dashboard */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
            <p className="text-3xl font-extrabold text-gray-800">{Object.values(testCases).flat().length}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Total Cases</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
            <p className="text-3xl font-extrabold text-green-600">
              {Object.values(testExecutions).filter(e => e.status === 'Passed').length}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">Passed</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-red-500">
            <p className="text-3xl font-extrabold text-red-600">
              {Object.values(testExecutions).filter(e => e.status === 'Failed').length}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">Failed</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500">
            <p className="text-3xl font-extrabold text-yellow-600">
              {Object.values(testExecutions).filter(e => e.status === 'Blocked').length}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">Blocked</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-gray-500">
            <p className="text-3xl font-extrabold text-gray-600">
              {Object.values(testCases).flat().length - Object.keys(testExecutions).length}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">Not Executed</p>
          </div>
        </section>

        <div className="flex space-x-6">
          {/* Tabs */}
          <aside className="w-1/5">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-sm font-semibold text-gray-600 mb-3">View</h2>
              <div className="space-y-1">
                <button
                    onClick={() => setCurrentView('testCases')}
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                        currentView === 'testCases' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    <span>Test Cases</span>
                </button>
                <button
                    onClick={() => setCurrentView('testStrategy')}
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                        currentView === 'testStrategy' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    <span>Test Strategy</span>
                </button>
              </div>
              <hr className="my-4" />
              <h2 className="text-sm font-semibold text-gray-600 mb-3">Test Suites</h2>
              <div className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => {
                        setCurrentView('testCases');
                        setActiveTab(tab.key);
                    }}
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                    activeTab === tab.key && currentView === 'testCases'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.key && currentView === 'testCases' ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="w-4/5">
          {currentView === 'testCases' ? (
              <>
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {/* Test Cases Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Scenario</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTestCases.map((tc, index) => {
                            const execution = testExecutions[tc.id];
                            return (
                                <tr key={tc.id} className={`hover:bg-blue-50 cursor-pointer ${selectedTestCase === tc.id ? 'bg-blue-100' : ''}`}
                                onClick={() => setSelectedTestCase(tc.id)}>
                                <td className="px-4 py-3 text-sm font-medium text-blue-600 whitespace-nowrap">{tc.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-800">{tc.scenario}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                    tc.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                                    tc.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                                    'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {tc.priority}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                    tc.type === 'Functional' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                                    }`}>
                                    {tc.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {execution ? (
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(execution.status)}
                                        <span className="text-xs font-medium text-gray-700">
                                        {execution.status}
                                        </span>
                                    </div>
                                    ) : (
                                    <span className="text-xs text-gray-500">Not Executed</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleExecuteTest(tc.id);
                                    }}
                                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs transition-colors shadow-sm"
                                    >
                                    <Play size={14} />
                                    <span>Execute</span>
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
                {selectedTestCase && selectedTC && (
                <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border-t-4 border-blue-600">
                    <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                        <FileText className="text-blue-600" size={22} />
                        <span>Test Case Details - {selectedTestCase}</span>
                    </h3>
                    <div className="flex items-center space-x-2">
                        {selectedTC.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {tag}
                        </span>
                        ))}
                    </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-5">
                        <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Scenario</label>
                        <p className="text-sm text-gray-800 mt-1">{selectedTC.scenario}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Priority</label>
                            <p className="text-sm text-gray-800 mt-1">{selectedTC.priority}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                            <p className="text-sm text-gray-800 mt-1">{selectedTC.type}</p>
                        </div>
                        </div>

                        <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">API Endpoint</label>
                        <p className="text-xs text-gray-800 mt-1 font-mono bg-gray-100 p-2 rounded-md">{selectedTC.endpoint}</p>
                        </div>

                        <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Pre-Conditions</label>
                        <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">{selectedTC.preConditions}</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                        <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Test Steps</label>
                        <ol className="mt-2 space-y-1">
                            {selectedTC.testSteps.map((step, idx) => (
                            <li key={idx} className="text-sm text-gray-800 flex space-x-2">
                                <span className="font-bold text-blue-600">{idx + 1}.</span>
                                <span>{step}</span>
                            </li>
                            ))}
                        </ol>
                        </div>

                        <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Expected Result</label>
                        <p className="text-sm text-gray-800 mt-1 whitespace-pre-line bg-green-50 p-3 rounded-md border border-green-200">
                            {selectedTC.expectedResult}
                        </p>
                        </div>
                    </div>
                    </div>

                    <div className="mt-6 border-t pt-5">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Test Data</label>
                    <div className="mt-2 bg-gray-900 text-white p-4 rounded-md text-xs font-mono">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(selectedTC.testData, null, 2)}</pre>
                    </div>
                    </div>

                    {/* Execution History */}
                    {testExecutions[selectedTestCase] && (
                    <div className="mt-6 border-t pt-5">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Last Execution</label>
                        <div className="mt-2 bg-gray-50 p-4 rounded-md space-y-3">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-semibold w-24">Status:</label>
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(testExecutions[selectedTestCase].status)}`}>
                            {testExecutions[selectedTestCase].status}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                            <User size={16} className="text-gray-500" />
                            <span className="text-gray-700">{testExecutions[selectedTestCase].executedBy}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                            <Calendar size={16} className="text-gray-500" />
                            <span className="text-gray-700">{testExecutions[selectedTestCase].executionTime}</span>
                        </div>
                        {testExecutions[selectedTestCase].comments && (
                            <div className="mt-2">
                            <label className="text-sm font-semibold text-gray-600">Comments:</label>
                            <p className="text-sm text-gray-700 mt-1 p-2 bg-white rounded">{testExecutions[selectedTestCase].comments}</p>
                            </div>
                        )}
                        </div>
                    </div>
                    )}
                </div>
                )}
              </>
          ) : (
              <TestStrategyViewer />
          )}
          </div>
        </div>
      </main>

      {/* Execution Modal */}
      {showExecutionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Execute Test Case - {selectedTestCase}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Execution Status *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Actual Result</label>
                <textarea
                  value={executionData.actualResult}
                  onChange={(e) => setExecutionData({ ...executionData, actualResult: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter actual result..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Executed By *</label>
                  <input
                    type="text"
                    value={executionData.executedBy}
                    onChange={(e) => setExecutionData({ ...executionData, executedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tester name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Execution Date *</label>
                  <input
                    type="date"
                    value={executionData.executionTime}
                    onChange={(e) => setExecutionData({ ...executionData, executionTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowExecutionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExecution}
                disabled={!executionData.status || !executionData.executedBy}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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
