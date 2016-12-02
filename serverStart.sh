git pull
npm i
bower i --allow-root
ember build --environment=production
cd backend
pm2 stop index
pm2 start index