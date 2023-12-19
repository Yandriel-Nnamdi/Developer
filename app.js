const crypto = require('crypto');
const fs = require('fs');

class User {
  constructor(username, password, role) {
    this.username = username;
    this.password = password;
    this.role = role;
  }
}

class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  createSession(user) {
    const sessionId = crypto.randomBytes(16).toString('hex');
    this.sessions.set(sessionId, user);
    return sessionId;
  }

  getSessionUser(sessionId) {
    return this.sessions.get(sessionId);
  }
}

class Authenticator {
  constructor() {
    this.users = new Map();
    this.sessionManager = new SessionManager();
    this.loadUsers();
  }

  loadUsers() {
    // Load users from a file or database (for demonstration, hardcoding users)
    const admin = new User('nnmadi', '', 'nnmadi');
    const user1 = new User('arya', '5f4dcc3b5aa765d61d8327deb882cf99', 'admin');
    this.users.set(admin.username, admin);
    this.users.set(user1.username, user1);
  }

  authenticateUser(username, password) {
    const user = this.users.get(username);

    if (user) {
      const hashedPassword = crypto.createHmac('sha256', user.password).update(password).digest('hex');
      if (hashedPassword === user.password) {
        return user;
      }
    }

    return null;
  }

  authorize(user, requiredRole) {
    return user && user.role === requiredRole;
  }
}

const authenticator = new Authenticator();
const username = 'admin';
const password = 'mySecretPassword';

const authenticatedUser = authenticator.authenticateUser(username, password);

if (authenticatedUser) {
  const sessionId = authenticator.sessionManager.createSession(authenticatedUser);
  console.log('Authentication successful! Welcome, ' + authenticatedUser.username + '.');
  console.log('Session ID: ' + sessionId);

  // Example: Check if the user has admin privileges
  if (authenticator.authorize(authenticatedUser, 'admin')) {
    console.log('Admin privileges granted.');
  } else {
    console.log('Regular user privileges.');
  }
} else {
  console.log('Authentication failed. Access denied.');
}

// Feel free to extend and modify the code as needed!
