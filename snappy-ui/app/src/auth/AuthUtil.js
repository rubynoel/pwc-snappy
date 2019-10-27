import { Auth } from "aws-amplify";
import aws4 from "aws4";
const signRequest = async opts => {
  const credentials = await Auth.currentCredentials();
  const { accessKeyId, secretAccessKey, sessionToken } = credentials;
  const request = aws4.sign(opts, {
    accessKeyId,
    secretAccessKey,
    sessionToken
  });
  delete request.headers.Host;
  return request;
};

export { signRequest };
