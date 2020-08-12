#!/bin/bash
# this script is for my ease of use. I deploy these images to a local raspberry pi that doesn't have internet access (it's an access point itself)

sed -i "s/localhost/$PI_HOST/g" client/src/main.js

app=display-remote
version=1.1.0
platform=linux/arm/v7
artifact=deployment$version.tar
rsa=~/.ssh/pi_rsa
images=(client server)
location=$PI_USER@$PI_LOCAL
deployment=""

echo "Building $app $version for $platform platform."

for image in "${images[@]}"; do
 docker build -t $app/$image:$version --platform $platform $image --no-cache
 deployment+="$app/$image "
done

sed -i "s/$PI_HOST/localhost/g" client/src/main.js
echo "Saved images $deployment to $artifact"
docker save -o $artifact $deployment
echo "Transferring $artifact to $location"
scp -i $rsa $artifact deploy-remote.sh $location:/home/$PI_USER
ssh -i $rsa -t $location ./deploy-remote.sh $artifact $app