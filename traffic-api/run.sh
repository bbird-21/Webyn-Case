# !/bin/sh

# Install Symfony dependencies using Composer
composer install --no-dev --optimize-autoloader
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

## Testing
# Install BrowserKit and HttpClient:
composer require --dev symfony/browser-kit symfony/http-client
# Run Symfony's built-in server
composer require --dev dama/doctrine-test-bundle
##
symfony serve --port=8000 --allow-all-ip
