# start frontend server
cd frontend/easychef
npm start &

# start backend server
cd ../..
source env/bin/activate
./easychef/manage.py runserver &