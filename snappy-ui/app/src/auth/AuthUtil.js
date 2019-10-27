import { Auth } from "aws-amplify";
import aws4 from "aws4";
const signRequest = async opts => {
  const credentials = await Auth.currentCredentials();
  console.log(`API ${JSON.stringify(credentials)}`);
  const { accessKeyId, secretAccessKey, sessionToken } = credentials;
  const request = aws4.sign(opts, {
    accessKeyId,
    secretAccessKey,
    sessionToken
  });
  console.log(`API signed ${JSON.stringify(request)}`);
  delete request.headers.Host;
  return request;
};

export { signRequest };
