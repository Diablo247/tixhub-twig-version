# Use official PHP runtime with built-in server
FROM php:8.2-cli

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install composer if needed
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php

# Install dependencies if you have composer.json
RUN composer install || true

# Expose port
EXPOSE 10000

# Run PHP built-in server
CMD ["php", "-S", "0.0.0.0:10000", "-t", "."]
