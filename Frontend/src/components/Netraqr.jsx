import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'antd';
import { baseUrl } from '../baseurl'; // Ensure this is the correct base URL for your backend
import Navbar from './Navbar';

const { Meta } = Card;

function Netraqr({ token }) {
  const [hallticketno, setHallticketno] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const processNetraid = async () => {
      try {
        if (!token) {
          setError('Token is missing');
          return;
        }

        const response = await axios.post(`${baseUrl}/api/netraqr`, {
          method: "32", // Adjust method as needed
        }, {
          headers: {
            Authorization: `Bearer ${token}` // Set token as Authorization header
          }
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

    processNetraid();
  }, [token]);

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

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Card style={{ width: '90%', maxWidth: 400, textAlign: 'center', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}>
          <Meta title="Netra Details" />
          {error && <p>{error}</p>}
          {hallticketno && <p style={{ marginBottom: 10 }}>Hall Ticket Number: {hallticketno}</p>}
          {qrImageUrl && <img src={qrImageUrl} alt="QR Code" style={{ width: '50%', height: 'auto', marginTop: 20 }} />}
        </Card>
      </div>
    </>
  );
}

export default Netraqr;
