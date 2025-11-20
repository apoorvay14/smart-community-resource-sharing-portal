import React from 'react';

function Navbar({ user, onLogout }) {
  return (
    <nav style={styles.navbar}>
      <div className="container" style={styles.navContainer}>
        <h1 style={styles.brand}>🏘️ Smart Community Portal</h1>
        <div style={styles.navRight}>
          <span style={styles.userName}>
            Welcome, {user?.name} {user?.role === 'admin' && '(Admin)'}
          </span>
          <button onClick={onLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userName: {
    fontSize: '1rem'
  },
  logoutBtn: {
    background: 'white',
    color: '#667eea',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default Navbar;
