import { ICognitoAuthService } from '@/common/cognito/application/interface/cognito.service.interface';

export const identityProviderServiceMock: jest.MockedObject<ICognitoAuthService> =
  {
    confirmPasswordReset: jest.fn(),
    confirmUserRegistration: jest.fn(),
    initiatePasswordReset: jest.fn(),
    loginUser: jest.fn(),
    refreshSession: jest.fn(),
    registerUser: jest.fn(),
    resendUserConfirmationCode: jest.fn(),
    getUserSub: jest.fn(),
    changePassword: jest.fn(),
  };
