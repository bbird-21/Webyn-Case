# !/bin/sh

# Install Symfony dependencies using Composer
composer install --optimize-autoloader
# Install and enable MakerBundle
composer require symfony/maker-bundle --dev
# Install Doctrine support
composer require orm
# Install DoctrineFixturesBundle
composer require orm-fixtures --dev
# Install Serializer
composer require symfony/serializer-pack
# Install PHPUnit
composer require --dev symfony/test-pack

### Testing
# Install BrowserKit and HttpClient:
composer require --dev symfony/browser-kit symfony/http-client
composer require --dev dama/doctrine-test-bundle
###

### Database Configuration
php bin/console doctrine:database:create --if-not-exists
php bin/console make:migration --no-interaction
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console doctrine:fixtures:load --no-interaction
###

# Run Symfony's built-in server
symfony serve --port=8000 --allow-all-ip
