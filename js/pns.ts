const request = require('request');
const http = require('http');

// const url = 'https://b4d8-43-241-130-149.ngrok.io/workman/workmenPostData';
const url = 'https://mapps.mahindra.com/econnect/workmenPostData';

const body = {
  itemID: '295',
  Title: 'Project v7',
  OriginalPNSNumber: '534',
  HDFreshProject: 'Fresh',
  TeamNo: '445',
  TPMPillars: 'OTPM',
  ProjectType: 'Officers Team',
  LossClassification: 'Set Up and Adjustment Loss',
  ProjectCategory: 'Cost',
  ExpectedCompletionDate: '10/10/2021',
  StartDate: '09/28/2021',
  ProjectCompletionFinancialYear: 'FY 17',
  Division: 'MSSL',
  PUZone: 'Channel Development',
  PGModuleSectionDeptCell: '56645',
  Member1Name: 'One',
  Member1TokenNo: '001',
  Member2Name: 'Two',
  Member2TokenNo: '002',
  Member3Name: 'Three',
  Member3TokenNo: '003',
  Member4Name: 'Four',
  Member4TokenNo: '004',
  Member5Name: 'Five',
  Member5TokenNo: '005',
  Member6Name: 'Six',
  Member6TokenNo: '006',
  Member7Name: 'Seven',
  Member7TokenNo: '007',
  ProblemDefinition: 'this is the test project',
  PastDataoftheProblem: 'problem',
  TargetforImprovement: 'target',
  NoofProbableCauses: '5',
  CauseandEffectDiagram: 'https://google.com',
  ListofRootCausesIdentified: '1. jcdls\n2. hckdsjcn\n3. cijsdlmkv',
  SolutionsImplemented: 'Solution',
  StandardizationinSystem: 'Standardization',
  DateofImplementationofSolution: '10/20/2021',
  StatusofProblemBefore: 'well going',
  PeriodforWhichImprovedResultsareMonitored: '6 months',
  Costofinvestmentsmadeifany: '3',
  ActualSavings: '3',
  SavingsCategory: 'Other Income',
  SavingsType: 'Budgeted',
  IntangibleBenefitstoTeamandOrganization: 'benefits to Organizations',
  Remarks: 'please check the details',
  StatusofProblemAfter: 'Test',
  AccountsApprover: 'S.ARJUN3@MAHINDRA.COM',
  ProjectApprover: 'S.ARJUN3@MAHINDRA.COM',
};

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

// request.post({ url, form: body }, function (err, httpResponse, body) {
//   console.log(body);
// });

request.get('https://mahindraremembers-uat.azurewebsites.net/api/CITPro/GetWorkmanItemTokenNo?ProjectLeadtokenno=%27119%27&Sts=All',function (err, httpResponse, body) {
  console.log(body);
})
