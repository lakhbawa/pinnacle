FROM lakhveerbawa/phpdock:arm

# Installing Node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && apt-get install -y nodejs

RUN chown -R www-data:www-data /var/www

WORKDIR /etc/supervisor

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
