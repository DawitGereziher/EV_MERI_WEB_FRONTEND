import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../landing/Footer';
import '../../styles/profile.css';
import Header from '../landing/Header';

const StationOwnerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending');

  const [formData, setFormData] = useState({
    company_name: '',
    website: '',
    business_registration_number: '',
    description: ''
  });

  const [documents, setDocuments] = useState({
    business_license: null,
    id_proof: null,
    utility_bill: null
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    business_license: false,
    id_proof: false,
    utility_bill: false
  });

  const isStep1Complete = () => {
    return formData.company_name && formData.business_registration_number;
  };

  const isStep2Complete = () => {
    return uploadedFiles.business_license && uploadedFiles.id_proof && uploadedFiles.utility_bill;
  };

  const fetchProfileData = async () => {
    console.log('Fetching profile data...');

    try {
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      const response = await fetch('https://mengedmate-backend.onrender.com/api/station-owners/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        setProfileData(data);

        // Update form data with existing profile data
        setFormData({
          company_name: data.company_name || '',
          website: data.website || '',
          business_registration_number: data.business_registration_number || '',
          description: data.description || ''
        });

        // Update verification status
        setVerificationStatus(data.verification_status || 'pending');
        setIsVerified(data.verification_status === 'verified');

        // Update uploaded files status based on existing documents
        setUploadedFiles({
          business_license: !!data.business_license,
          id_proof: !!data.id_proof,
          utility_bill: !!data.utility_bill
        });

      } else if (response.status === 401) {
        console.log('Unauthorized, removing token and redirecting to login');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Failed to fetch profile:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data. Please refresh the page.');
    }
  };

  useEffect(() => {
    fetchProfileData();

    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, []);

  useEffect(() => {
    // Update current step based on completion
    if (isStep1Complete() && isStep2Complete()) {
      setCurrentStep(3);
    } else if (isStep1Complete()) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [formData, uploadedFiles]);

  useEffect(() => {
    // Redirect verified users to dashboard
    if (isVerified && profileData) {
      navigate('/dashboard');
    }
  }, [isVerified, profileData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    if (error) setError('');

    // URL validation for website field
    if (name === 'website' && value) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(value)) {
        setError('Please enter a valid website URL (e.g., https://example.com)');
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (documentType, file) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: file
    }));
    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: true
    }));
  };

  const handleSubmit = async () => {
    if (!isStep1Complete() || !isStep2Complete()) {
      setError('Please complete all required fields and upload all documents');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add files
      Object.keys(documents).forEach(key => {
        if (documents[key]) {
          formDataToSend.append(key, documents[key]);
        }
      });

      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/station-owners/profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        // Refresh profile data to show updated status
        await fetchProfileData();

        // Redirect to pending verification page
        navigate('/verification-pending', {
          state: {
            message: 'Profile submitted successfully! Your documents are now under review.'
          }
        });
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit profile. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };
    

  return (
       
    <div className="profile-page">
      

      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-sidebar">
            <h2>Submit Information</h2>

            {isVerified && (
              <div className="verification-status verified">
                <div className="status-icon">✓</div>
                <div className="status-text">
                  <h3>Verified</h3>
                  <p>Your account has been verified</p>
                </div>
              </div>
            )}

            {verificationStatus === 'pending' && profileData && profileData.is_profile_completed && (
              <div className="verification-status pending">
                <div className="status-icon">⏳</div>
                <div className="status-text">
                  <h3>Under Review</h3>
                  <p>Your documents are being reviewed</p>
                </div>
              </div>
            )}

            {verificationStatus === 'rejected' && (
              <div className="verification-status rejected">
                <div className="status-icon">❌</div>
                <div className="status-text">
                  <h3>Verification Failed</h3>
                  <p>Please update your documents</p>
                </div>
              </div>
            )}

            <div className="step-list">
              <div className={`step-item ${isStep1Complete() ? 'completed' : currentStep === 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Company Information</h3>
                  <p>Basic details about your business</p>
                </div>
              </div>

              <div className={`step-item ${isStep2Complete() ? 'completed' : currentStep === 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Document Upload</h3>
                  <p>Upload required documents</p>
                </div>
              </div>

              <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Verification</h3>
                  <p>Submit for review</p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="content-section">
              <h2>Company Information</h2>
              <p>Please provide details about your business. This information will be used to verify your account.</p>

              {message && (
                <div className="info-message">
                  {message}
                </div>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="company_name">Company Name *</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="MengedMate"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website">Website (Optional)</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="Enter your website URL"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="business_registration_number">Business Registration Number *</label>
                  <input
                    type="text"
                    id="business_registration_number"
                    name="business_registration_number"
                    value={formData.business_registration_number}
                    onChange={handleInputChange}
                    placeholder="Enter Your Business Registration Number"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Company Description (Optional)</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about your company and the charging services you provide"
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div className="content-section">
              <h2>Required Documents</h2>

              <div className="documents-grid">
                <DocumentUpload
                  title="Upload your ID proof"
                  subtitle="JPG, PNG"
                  documentType="id_proof"
                  onFileUpload={handleFileUpload}
                  isUploaded={uploadedFiles.id_proof}
                />

                <DocumentUpload
                  title="Upload your License"
                  subtitle="JPG, PNG"
                  documentType="business_license"
                  onFileUpload={handleFileUpload}
                  isUploaded={uploadedFiles.business_license}
                />

                <DocumentUpload
                  title="Upload your utility bill"
                  subtitle="JPG, PNG"
                  documentType="utility_bill"
                  onFileUpload={handleFileUpload}
                  isUploaded={uploadedFiles.utility_bill}
                />
              </div>
            </div>

            <div className="content-section">
              {isVerified ? (
                <>
                  <h2>Account Verified</h2>
                  <p>Congratulations! Your account has been verified. You can now access all features of the platform.</p>

                  <button
                    className="btn btn-primary submit-btn verified"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </button>
                </>
              ) : verificationStatus === 'pending' && profileData && profileData.is_profile_completed ? (
                <>
                  <h2>Verification in Progress</h2>
                  <p>Your documents have been submitted and are currently under review. This typically takes 1-3 business days.</p>

                  <button
                    className="btn btn-secondary submit-btn"
                    disabled
                  >
                    Verification Pending
                  </button>

                  <p className="submit-note">
                    You will receive an email notification once the verification is complete.
                  </p>
                </>
              ) : verificationStatus === 'rejected' ? (
                <>
                  <h2>Verification Failed</h2>
                  <p>Your verification was unsuccessful. Please update your documents and resubmit for review.</p>

                  <button
                    className="btn btn-primary submit-btn"
                    onClick={handleSubmit}
                    disabled={loading || !isStep1Complete() || !isStep2Complete()}
                  >
                    {loading ? 'Resubmitting...' : 'Resubmit for verification'}
                  </button>
                </>
              ) : (
                <>
                  <h2>Submit for Verification</h2>
                  <p>Once you submit your information, our team will review your application and verify your account. This typically takes 1-3 business days.</p>

                  <button
                    className="btn btn-primary submit-btn"
                    onClick={handleSubmit}
                    disabled={loading || !isStep1Complete() || !isStep2Complete()}
                  >
                    {loading ? 'Submitting...' : 'Submit for verification'}
                  </button>

                  <p className="submit-note">
                    By submitting, you agree to our terms and conditions.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const DocumentUpload = ({ title, subtitle, documentType, onFileUpload, isUploaded }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(documentType, file);
    }
  };

  return (
    <div className={`document-upload ${isUploaded ? 'uploaded' : ''}`}>
      <div className="upload-icon">
        {isUploaded ? '✓' : '📄'}
      </div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id={`file-${documentType}`}
      />
      <label htmlFor={`file-${documentType}`} className="upload-btn">
        {isUploaded ? 'Uploaded' : 'Choose File'}
      </label>
    </div>
  );
};

export default StationOwnerProfile;
