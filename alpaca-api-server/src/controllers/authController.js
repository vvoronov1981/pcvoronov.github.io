const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

class AuthController {
  /**
   * Login endpoint - authenticate user and return JWT token
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username and password are required'
        });
      }

      // In production, you should use a database with hashed passwords
      // This is a simplified version for demonstration
      const validUsername = config.auth.username;
      const validPassword = config.auth.password;

      if (username !== validUsername || password !== validPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { username, userId: 1 },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      res.json({
        success: true,
        data: {
          token,
          expiresIn: config.jwtExpiresIn,
          user: {
            username
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  }

  /**
   * Verify token endpoint - check if token is valid
   */
  async verifyToken(req, res) {
    try {
      // If middleware passed, token is valid
      res.json({
        success: true,
        data: {
          user: req.user,
          message: 'Token is valid'
        }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({
        success: false,
        error: 'Token verification failed'
      });
    }
  }
}

module.exports = new AuthController();
