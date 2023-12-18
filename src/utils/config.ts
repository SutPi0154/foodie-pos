interface Config {
  backOfficeApiUrl: string;
  orderApiUrl: string;
  googleClientId: string;
  googleClientSecret: string;
  spaceAccesskeyId: string;
  spaceSecretAccessKey: string;
  spaceEndpoint: string;
  orderAppUrl: string;
}

export const config: Config = {
  backOfficeApiUrl: process.env.NEXT_PUBLIC_BACKOFFICE_API_BASE_URL || "",
  orderApiUrl: process.env.NEXT_PUBLIC_ORDER_API_BASE_URL || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  spaceAccesskeyId: process.env.SPACE_ACCESS_KEY_ID || "",
  spaceSecretAccessKey: process.env.SPACE_SECRET_ACCESS_KEY || "",
  spaceEndpoint: process.env.SPACE_ENDPOINT || "",
  orderAppUrl: process.env.ORDER_APP_URL || "",
};
