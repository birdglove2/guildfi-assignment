// message used to sign from frontend to prove identity of wallet address
// this message must be the same as that of frontend
export const MESSAGE = 'Hello from backend';

export interface CredentialAttrs {
  walletAddress: string;
  signature: string;
}
