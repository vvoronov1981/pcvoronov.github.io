# Deployment Guide - Alpaca Trading API Server

This guide explains how to deploy the Alpaca Trading API Server to production.

## Deployment Options

### 1. Deploy to Heroku

1. Install Heroku CLI:
```bash
npm install -g heroku
```

2. Login to Heroku:
```bash
heroku login
```

3. Create a new Heroku app:
```bash
cd alpaca-api-server
heroku create your-app-name
```

4. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-random-secret-key
heroku config:set ALPACA_API_KEY=your-alpaca-key
heroku config:set ALPACA_API_SECRET=your-alpaca-secret
heroku config:set ALPACA_BASE_URL=https://paper-api.alpaca.markets
heroku config:set API_USERNAME=your-username
heroku config:set API_PASSWORD=your-secure-password
```

5. Create a `Procfile`:
```bash
echo "web: node src/server.js" > Procfile
```

6. Deploy:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 2. Deploy to DigitalOcean App Platform

1. Create a DigitalOcean account
2. Go to App Platform
3. Connect your GitHub repository
4. Select the `alpaca-api-server` directory
5. Set environment variables in the App Settings
6. Deploy

### 3. Deploy to AWS EC2

1. Launch an EC2 instance (Ubuntu 20.04 or later)
2. SSH into your instance
3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone your repository:
```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo/alpaca-api-server
```

5. Install dependencies:
```bash
npm install --production
```

6. Create `.env` file with production values

7. Install PM2 for process management:
```bash
sudo npm install -g pm2
```

8. Start the server:
```bash
pm2 start src/server.js --name alpaca-api
pm2 save
pm2 startup
```

9. Set up Nginx as a reverse proxy:
```bash
sudo apt-get install nginx
```

Create Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

10. Enable HTTPS with Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 4. Deploy with Docker

1. Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

2. Create a `docker-compose.yml`:
```yaml
version: '3.8'

services:
  alpaca-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - JWT_SECRET=${JWT_SECRET}
      - ALPACA_API_KEY=${ALPACA_API_KEY}
      - ALPACA_API_SECRET=${ALPACA_API_SECRET}
      - ALPACA_BASE_URL=${ALPACA_BASE_URL}
      - API_USERNAME=${API_USERNAME}
      - API_PASSWORD=${API_PASSWORD}
    restart: unless-stopped
```

3. Build and run:
```bash
docker-compose up -d
```

## Production Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Change API_USERNAME and API_PASSWORD
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Configure CORS for specific domains
- [ ] Set up database for user management (optional)
- [ ] Enable rate limiting
- [ ] Set up backup strategy
- [ ] Configure domain name
- [ ] Test all endpoints
- [ ] Set up CI/CD pipeline

## Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<strong-random-secret-minimum-32-characters>
ALPACA_API_KEY=<your-alpaca-api-key>
ALPACA_API_SECRET=<your-alpaca-api-secret>
ALPACA_BASE_URL=https://paper-api.alpaca.markets
API_USERNAME=<your-secure-username>
API_PASSWORD=<your-secure-password>
CORS_ORIGIN=https://yourdomain.com
```

## Security Best Practices

1. **Use HTTPS**: Always use HTTPS in production
2. **Secure JWT Secret**: Use a strong, random JWT secret (minimum 32 characters)
3. **Strong Passwords**: Use strong passwords for API authentication
4. **Database**: Consider using a database for user management instead of environment variables
5. **Rate Limiting**: Configure rate limiting appropriately for your use case
6. **CORS**: Set CORS_ORIGIN to your specific domain(s)
7. **Monitoring**: Set up monitoring and alerting
8. **Logs**: Implement proper logging (consider using services like LogDNA, Papertrail)
9. **Updates**: Keep dependencies updated
10. **Backups**: Regular backups of configuration and data

## Monitoring

Consider using these services for monitoring:

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Log Management**: LogDNA, Papertrail
- **Performance Monitoring**: New Relic, DataDog

## Troubleshooting

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

### Permission denied
```bash
# Run with sudo (not recommended for production)
sudo node src/server.js
# Or change the port to > 1024 in .env
PORT=3000
```

### Cannot connect to Alpaca API
- Check your API keys
- Verify ALPACA_BASE_URL is correct
- Check if your IP is whitelisted in Alpaca settings
- Verify network connectivity

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Email: voronov.voldymyr@gmail.com
