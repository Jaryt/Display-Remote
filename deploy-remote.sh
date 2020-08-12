echo "Loading docker images from $1"
docker load --input $1
echo "Restarting Display Remote"
sudo service $2 restart
sudo service $2 status