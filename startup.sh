# set up virtual environment
python3 -m venv env
. env/bin/activate
pip install Django
python3 -m pip install --upgrade Pillow
pip install djangorestframework
pip install django-cors-headers

# migrate database
python3 ./easychef/manage.py makemigrations
python3 ./easychef/manage.py migrate

# install dependencies
cd frontend/easychef/
npm install