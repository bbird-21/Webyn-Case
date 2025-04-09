# Use a PHP 8.2-fpm image
FROM php:8.3-fpm

# Install dependencies needed for Symfony
RUN apt-get update && apt-get install -y \
    vim \
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

# Creates a local certificate authority
RUN symfony server:ca:install
# Forces the OS inside the container image to recognize the newly installed CA certificate system-wide during the build.
RUN update-ca-certificates

# Define ARG for user/group ID
ARG PUID=1000
ARG PGID=1000

# Change ownership of the config/certs created by root during build
RUN chown -R ${PUID}:${PGID} /root/.symfony5

# Set the working directory to the Symfony project
WORKDIR /var/www/html

# Copy the Symfony project files into the container
COPY . .

# Expose port 8000 (Symfony's default port for the built-in server)
EXPOSE 8000

# Run Symfony's built-in server
ENTRYPOINT ["sh", "run.sh"]
