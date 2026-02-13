import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Card, Spinner, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { 
  validateEmail, 
  validatePassword, 
  validateUsername, 
  validateRequiredField, 
  validatePhone,
  getPasswordStrengthColor 
} from '../utils/validation';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ strength: 'none', message: '' });

  const { username, email, fullName, password, confirmPassword, phoneNumber } = formData;

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }

    // Real-time password strength validation
    if (name === 'password') {
      const strength = validatePassword(value);
      setPasswordStrength(strength);
    }

    // Real-time confirm password validation
    if (name === 'confirmPassword' || (name === 'password' && confirmPassword)) {
      const passwordToCheck = name === 'password' ? value : password;
      const confirmToCheck = name === 'confirmPassword' ? value : confirmPassword;
      
      if (confirmToCheck && passwordToCheck !== confirmToCheck) {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match'
        });
      } else if (errors.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: ''
        });
      }
    }
  };

  // Validate field on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Validate individual field
  const validateField = (name, value) => {
    let fieldError = '';

    switch (name) {
      case 'username':
        const usernameCheck = validateUsername(value);
        if (!usernameCheck.isValid) {
          fieldError = usernameCheck.message;
        }
        break;
      case 'email':
        const requiredCheck = validateRequiredField(value, 'Email');
        if (!requiredCheck.isValid) {
          fieldError = requiredCheck.message;
        } else if (!validateEmail(value)) {
          fieldError = 'Please enter a valid email address';
        }
        break;
      case 'fullName':
        const nameCheck = validateRequiredField(value, 'Full Name');
        if (!nameCheck.isValid) {
          fieldError = nameCheck.message;
        } else if (value.length < 2) {
          fieldError = 'Full name must be at least 2 characters';
        }
        break;
      case 'password':
        const passwordCheck = validatePassword(value);
        if (!passwordCheck.isValid) {
          fieldError = passwordCheck.message;
        }
        break;
      case 'confirmPassword':
        if (!value) {
          fieldError = 'Please confirm your password';
        } else if (value !== password) {
          fieldError = 'Passwords do not match';
        }
        break;
      case 'phoneNumber':
        if (value && !validatePhone(value)) {
          fieldError = 'Please enter a valid phone number (e.g., 03001234567)';
        }
        break;
      default:
        break;
    }

    setErrors({
      ...errors,
      [name]: fieldError
    });

    return fieldError === '';
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};

    // Validate username
    const usernameCheck = validateUsername(username);
    if (!usernameCheck.isValid) {
      newErrors.username = usernameCheck.message;
    }

    // Validate email
    const emailRequired = validateRequiredField(email, 'Email');
    if (!emailRequired.isValid) {
      newErrors.email = emailRequired.message;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate full name
    const nameRequired = validateRequiredField(fullName, 'Full Name');
    if (!nameRequired.isValid) {
      newErrors.fullName = nameRequired.message;
    } else if (fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Validate password
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      newErrors.password = passwordCheck.message;
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate phone (optional but if provided, must be valid)
    if (phoneNumber && !validatePhone(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number (e.g., 03001234567)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username,
        email,
        full_name: fullName,
        password,
        phone_number: phoneNumber || null
      };

      const result = await register(userData);

      if (result.success) {
        setSuccess('Registration successful! Redirecting to login...');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid for submit button
  const isFormValid = () => {
    return username && email && fullName && password && confirmPassword && 
           Object.keys(errors).every(key => !errors[key]) &&
           passwordStrength.isValid;
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">Create Account</h2>
                <p className="text-muted">Join the ShareHub community</p>
              </div>

              {/* Success Alert */}
              {success && (
                <Alert variant="success" className="mb-4">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              {/* Registration Form */}
              <Form onSubmit={handleSubmit} noValidate>
                {/* Username Field */}
                <Form.Group className="mb-3">
                  <Form.Label>Username *</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter username (3-50 chars, letters, numbers, underscore)"
                    className={errors.username ? 'is-invalid' : ''}
                    disabled={loading}
                  />
                  {errors.username && (
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Email Field */}
                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your email"
                    className={errors.email ? 'is-invalid' : ''}
                    disabled={loading}
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Full Name Field */}
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    className={errors.fullName ? 'is-invalid' : ''}
                    disabled={loading}
                  />
                  {errors.fullName && (
                    <Form.Control.Feedback type="invalid">
                      {errors.fullName}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter password (min 8 chars, 1 upper, 1 lower, 1 number)"
                    className={errors.password ? 'is-invalid' : ''}
                    disabled={loading}
                  />
                  {errors.password && (
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Password Strength:</small>
                        <small className={`text-${getPasswordStrengthColor(passwordStrength.strength)}`}>
                          {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                        </small>
                      </div>
                      <ProgressBar 
                        variant={getPasswordStrengthColor(passwordStrength.strength)}
                        now={passwordStrength.strength === 'strong' ? 100 : passwordStrength.strength === 'medium' ? 60 : 30}
                        style={{ height: '4px' }}
                      />
                      <small className={`text-${getPasswordStrengthColor(passwordStrength.strength)}`}>
                        {passwordStrength.message}
                      </small>
                    </div>
                  )}
                </Form.Group>

                {/* Confirm Password Field */}
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'is-invalid' : ''}
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Phone Number Field */}
                <Form.Group className="mb-4">
                  <Form.Label>Phone Number (Optional)</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="03001234567"
                    className={errors.phoneNumber ? 'is-invalid' : ''}
                    disabled={loading}
                  />
                  {errors.phoneNumber && (
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  )}
                  <Form.Text className="text-muted">
                    Pakistani format: 03001234567
                  </Form.Text>
                </Form.Group>

                {/* Submit Button */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 mb-3"
                  disabled={loading || !isFormValid()}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        className="me-2"
                      />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Create Account
                    </>
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-primary fw-semibold text-decoration-none"
                      style={{ pointerEvents: loading ? 'none' : 'auto' }}
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;