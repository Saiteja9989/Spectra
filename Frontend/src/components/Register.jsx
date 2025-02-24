import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { UserPlus, Loader2, Phone } from 'lucide-react';
import { baseUrl } from '../baseurl';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Modal from './Modal'; // Import the updated Modal component
import { useDarkMode } from './DarkModeContext'; // Import the dark mode hook

function Register() {
  const { darkMode } = useDarkMode(); // Access dark mode state
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('info'); // 'info', 'success', 'error'
  const [modalContent, setModalContent] = useState(null);
  const [modalAction, setModalAction] = useState(null); // For confirm actions

  // Open modal function
  const openModal = (title, type, content, action = null) => {
    setModalTitle(title);
    setModalType(type);
    setModalContent(content);
    setModalAction(() => action);
    setIsModalOpen(true);
  };

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
  };

  const handleResultClick = async (result) => {
    try {
      const response = await axios.post(`${baseUrl}/api/def-token-register`, {
        phnumber: result,
      });
      console.log(result);
      if (response.status === 201) {
        openModal(
          'Already exists!',
          'warning',
          <p>{response.data.message}</p>
        );
      } else {
        openModal(
          'Success!',
          'success',
          <p>Search for {response.data.name}</p>
        );
      }
    } catch (error) {
      if (error.response?.status === 500) {
        showPasswordPrompt(result);
      } else {
        console.error('Error logging in:', error);
        openModal(
          'Error',
          'error',
          <p>Failed to log in. Please try again.</p>
        );
      }
    }
  };

  const showPasswordPrompt = (result) => {
    openModal(
      'Enter KMIT Netra Password',
      'info',
      <div>
        <input
          type="password"
          id="password"
          className={`w-full p-2 rounded border ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
          placeholder="Password"
          autoComplete="off"
        />
      </div>,
      async () => {
        const password = document.getElementById('password').value;
        if (!password) {
          openModal('Error', 'error', <p>Password is required.</p>);
          return;
        }
        try {
          const response = await axios.post(`${baseUrl}/api/get-token-register`, {
            phnumber: result,
            password: password,
          });
          if (response.data.name) {
            openModal(
              'Success!',
              'success',
              <p>Search for {response.data.name}</p>
            );
          } else {
            openModal(
              'Error',
              'error',
              <p>Invalid token. Please try again.</p>
            );
          }
        } catch (error) {
          console.error('Error logging in:', error);
          openModal(
            'Error',
            'error',
            <p>Login failed. Please try again.</p>
          );
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleResultClick(phoneNumber);
      setPhoneNumber('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center p-4`}>
      <Navbar />

      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className={`mt-6 text-3xl font-extrabold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Welcome to Spectra
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Please enter your details to register
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Student Phone Number (Netra)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`block w-full pl-11 pr-4 py-3 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              relative w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white
              transition-all duration-200 ease-in-out
              ${loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }
            `}
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-200" />
              ) : (
                <UserPlus className="h-5 w-5 text-blue-200" />
              )}
            </span>
            {loading ? 'Processing...' : 'Register Now'}
          </button>

          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className="h-px w-12 bg-gray-200"></div>
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Already registered?</span>
            <div className="h-px w-12 bg-gray-200"></div>
          </div>

          <div className="text-center">
            <a
              href="/search"
              className={`text-sm font-medium ${
                darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              } transition-colors duration-200`}
            >
              Check Details
            </a>
          </div>
        </form>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        type={modalType}
      >
        {modalContent}
        {modalAction && (
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                modalAction();
                closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Register;