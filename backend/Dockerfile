FROM ubuntu:20.04
# Setup user
RUN useradd -ms /bin/bash sandbox 

# Setup working directory
WORKDIR /home/sandbox

# update the ubuntu machine
RUN apt update && apt upgrade -y

# Install nano and curl
RUN apt install nano curl -y 

# Install nodejs
RUN apt install -y ca-certificates gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt update && apt install -y nodejs

# configuring terminal to display current working directory
RUN echo "PS1='\w '" >> /home/sandbox/.bashrc

# Setup final working directory
WORKDIR /home/sandbox/app