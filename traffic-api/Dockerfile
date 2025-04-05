# Use a minimal PHP 8.2 image with Debian as the base
FROM php:8.2-cli

# Install dependencies needed for Symfony
RUN apt-get update && apt-get install -y \
	wget \
    git \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# Install Symfony globally
RUN wget https://get.symfony.com/cli/installer -O - | bash
RUN mv /root/.symfony5/bin/symfony /usr/local/bin/symfony
# Set the working directory to the Symfony project
WORKDIR /var/www/html

# Copy the Symfony project files into the container
COPY . .

# Install Symfony dependencies using Composer
RUN composer install --no-dev --optimize-autoloader

# Expose port 8000 (Symfony's default port for the built-in server)
EXPOSE 8000

# Run Symfony's built-in server
# CMD ["symfony", "serve", "--no-tls", "--port=8000"]
CMD [ "tail", "-f"]
