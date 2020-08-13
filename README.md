# Display Remote

First things first - 
This was developed for a pretty particular use case, and this project has to deploy to a raspberry pi that has no internet. I wrote this entire damn thing in Java and PHP at one point so go ahead. point and laugh 🙁 Thankfully this iteration is a lot more to the point and practical. The Java thing was a nightmare... prototype.

The `client` and `server` are both served from the raspberry pi, which is configured as a wireless access point. This allows any user to connect to the WiFi on the raspberry pi, and access the locally served website. It's a workaround for sure, and maybe there's a better solution? Whatever, I just wanted to develop a lightweight slideshow that can be edited from any browser. 

This documentation is written to suite that specific use case. Feel free to adjust to your needs & contribute!!


# Quick Start

```
git clone git@github.com:Jaryt/Display-Remote.git
cd Display-Remote/client
npm install
cd ../server
npm install
```

## Running Development

### Client ([vuejs](https://vuejs.org/) & [nodejs](https://nodejs.org/en/))
  `npm run serve`

### Server ([nodejs](https://nodejs.org/en/) - [express](https://expressjs.com/))
  `node index.js`
  
## Deploying Host
  ### Environment Variables
  `$PI_HOST` - Public IP Address
  `$PI_LOCAL` - Private IP Address
  `$PI_USER` - User to log into pi

   #### `./deploy-local.sh`
   > Replaces hardcoded localhost address with `$PI_HOST`, builds and copies docker images to host machine. Lastly, `deploy-remote.sh` is executed on the host device which loads the deployment and restarts the docker compose service.
  
## Running Host
`docker-compose up` - (I have this configured to run by a systemd service at boot)

### Docker
 `client` uses [node base image](https://hub.docker.com/_/node/) (Currently hardcoded to [arm v7 node image](https://hub.docker.com/r/arm32v7/node))
 `server` uses node and [nginx](https://hub.docker.com/_/nginx) Currently hardcoded to [arm v7 ngnix image](https://hub.docker.com/r/arm32v7/nginx))
  
  I'm using the arm images to build on any arch and then deploy on arm7. I couldn't get it to run on the Pi normally.
  
