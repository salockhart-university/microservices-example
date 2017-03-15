# CSCI 4145 Project Part A - Team 4

Set of microservices for deploying the workflow for Part A.

# Provisioning Instance

1. Start a new instance running Ubuntu 16.04 LTS
2. Update the package manager
`sudo apt-get update && sudo apt-get dist-upgrade -y`

3. Install the required build tools
`sudo apt-get install -y curl build-essential git-core`

4. Forward port 80 to port 3000, where the application runs
`sudo iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-port 3000`

5. Persist the changes
`sudo apt-get install -y iptables-persistent`
This will ask if you want to keep IPv4 and IPv6 entries, say yes to both.

6. Install NVM
`curl https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash`

7. Refresh with the NVM information stored in profile
`source ~/.profile`

8. Install Node v6
`nvm install 6`
`nvm alias default 6`

9. Install Forever
`npm install -g forever`

# Running Assignment
## Select a Service
Each web service has its own folder in the project.  

## Record IP Address
For the instance that you are deploying for, make sure to update the prod.json config for that instance with the IP it can be reached at.

## Copy
Copy all of the project files into the VM instance

## Install Dependencies
Change directory to the web service that you will be running
`npm install`

## Deploying using Forever
To ensure the server will always run,
`forever start app.js`
