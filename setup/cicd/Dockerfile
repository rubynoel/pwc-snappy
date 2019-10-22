FROM amd64/alpine:3.7

RUN apk update
RUN apk add  zip unzip wget python3-pip jq curl docker terraform

RUN rc-update add docker boot

#RUN wget https://releases.hashicorp.com/terraform/0.12.10/terraform_0.12.10_linux_amd64.zip

#RUN unzip terraform_0.12.10_linux_amd64.zip

#RUN mv terraform /usr/local/bin/

RUN echo "Terraform installed" && terraform --version

RUN pip3 install awscli --upgrade

RUN echo "AWS CLI installed" && aws --version

WORKDIR /techtest

COPY ./cicd /techtest/

COPY ./cfn-templates /techtest/cfn-templates
COPY ./cicd/batch /techtest/batch
COPY ./common.sh /techtest/


RUN chmod +x /techtest/deploy.sh

RUN chmod +x /techtest/common.sh

ENTRYPOINT ["/techtest/deploy.sh"]
