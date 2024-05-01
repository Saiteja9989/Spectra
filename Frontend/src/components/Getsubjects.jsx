import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetSubjects = ({ netraID }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/getsubjects', { netraID });
        setSubjects(response.data.uniqueSubjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    if (netraID) {
      fetchSubjects();
    }
  }, [netraID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Subjects</h2>
      <ul>
        {subjects.map((subject, index) => (
          <li key={index}>{subject}</li>
        ))}
      </ul>
    </div>
  );
};

export default GetSubjects;
