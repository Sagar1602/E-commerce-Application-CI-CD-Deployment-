// Client-side validation for the OneCart login page.
(function () {
  const form = document.getElementById('loginForm');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');

  // Username must be an email id -> must contain '@'.
  function validateUsername() {
    const value = username.value.trim();
    if (value === '') {
      usernameError.textContent = 'Email id is required.';
      return false;
    }
    // Only an email id is accepted: it must contain '@'.
    if (!value.includes('@')) {
      usernameError.textContent = 'Invalid username: only an email id (with @) is accepted.';
      return false;
    }
    usernameError.textContent = '';
    return true;
  }

  // Password must contain at least one uppercase, one lowercase and one special character.
  function validatePassword() {
    const value = password.value;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\[\]\\/+=;'`~]/.test(value);

    if (value === '') {
      passwordError.textContent = 'Password is required.';
      return false;
    }
    if (!hasUpper || !hasLower || !hasSpecial) {
      passwordError.textContent =
        'Password must contain at least one uppercase letter, one lowercase letter and one special character.';
      return false;
    }
    passwordError.textContent = '';
    return true;
  }

  username.addEventListener('input', validateUsername);
  password.addEventListener('input', validatePassword);

  form.addEventListener('submit', function (e) {
    const okUser = validateUsername();
    const okPass = validatePassword();
    if (!okUser || !okPass) {
      e.preventDefault(); // block submission until both fields are valid
    }
  });
})();
