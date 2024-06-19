import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'antd';
import { baseUrl } from '../baseurl';
import Navbar from './Navbar';

const { Meta } = Card;

function Netraqr({ netraID }) {
  const [hallticketno, setHallticketno] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const processNetraid = async () => {
      try {
        const token = getCookie('token'); // Function to retrieve token from cookies
        console.log(token);
        if (!token) {
          setError('Token not found in cookies');
          return;
        }

        const response = await axios.post(`${baseUrl}/api/netraqr`, {
          netraid: netraID,
          token: token
        });

        if (response.data && response.data.hallticketno) {
          const fetchedHallticketno = response.data.hallticketno;
          setHallticketno(fetchedHallticketno);
          setError('');
          fetchQRImage(fetchedHallticketno);
        } else {
          setError('Unable to retrieve hall ticket number');
        }
      } catch (error) {
        console.error('Error processing netraid:', error.message);
        setError('Error processing netraid');
      }
    };

    if (netraID) {
      processNetraid();
    }
  }, [netraID]);

  const fetchQRImage = async (hallticketno) => {
    try {
      const response = await axios.post(`${baseUrl}/api/fetchqr`, {
        hallticketno
      });

      if (response.data && response.data.imageUrl) {
        setQrImageUrl(response.data.imageUrl);
      } else {
        setError('Failed to fetch QR image');
      }
    } catch (error) {
      console.error('Error fetching QR image:', error.message);
      setError('Error fetching QR image');
    }
  };

  // Function to get cookie by name
  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return cookieValue;
      }
    }
    return null;
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Card style={{ width: '90%', maxWidth: 400, textAlign: 'center', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}>
          <Meta title="Netra Details" />
          {error && <p>{error}</p>}
          {netraID && <p style={{ fontWeight: 'bold' }}>Netraid: {netraID}</p>}
          {hallticketno && <p style={{ marginBottom: 10 }}>Hall Ticket Number: {hallticketno}</p>}
          {qrImageUrl && <img src={qrImageUrl} alt="QR Code" style={{ width: '50%', height: 'auto', marginTop: 20 }} />}
        </Card>
      </div>
    </>
  );
}

export default Netraqr;
