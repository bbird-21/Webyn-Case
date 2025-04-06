# !/bin/sh

# Install Symfony dependencies using Composer
composer install --no-dev --optimize-autoloader
# Install and enable MakerBundle
composer require symfony/maker-bundle --dev
composer require orm
# composer require symfony/orm-pack
# Run Symfony's built-in server
symfony serve --port=8000 --allow-all-ip
